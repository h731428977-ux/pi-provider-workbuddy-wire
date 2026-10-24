/**
 * WorkBuddy desktop "at-rest" credential decryption.
 *
 * From 5.6.0 the desktop app stores `auth.accessToken` / `auth.refreshToken`
 * (and `nickname`) not as plain strings but as a wrapper:
 *
 *   { "$wbEncrypted": 1, "envelope": "<base64 of a JSON envelope>" }
 *
 * where the envelope is `{suite, keyId, nonce, authTag, ciphertext}` for
 * AES-256-GCM with a 12-byte nonce and a 16-byte tag. The authenticated
 * additional data is a length-prefixed transcript over the scheme, suite,
 * keyId and framing, so the ciphertext only opens for the exact field shape
 * it was sealed for.
 *
 * The field key is NOT a user secret: it is a build-time constant inside the
 * app's own Electron native module (`electron_browser_workbuddy_storage`).
 * The app fetches it through `loggerGet()` and hashes the returned base64
 * STRING (not the decoded bytes) to obtain the 32-byte key; `keyId` is the
 * first 16 hex characters of that key's SHA-256.
 *
 * This module re-derives the same key by asking the installed app for the same
 * payload, and caches it in memory for the process lifetime. Nothing is
 * written to disk; the payload is never logged.
 *
 * Wire format and AAD transcript follow the measured protocol in
 * dingminhua/dsh-connect-workbuddy (MIT).
 */

import { execFile } from 'node:child_process'
import { createDecipheriv, createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, win32 } from 'node:path'

/** A `{$wbEncrypted:1,envelope}` field wrapper — the only shape this opens. */
export interface WorkBuddyEncryptedField {
  $wbEncrypted: 1
  envelope: string
}

/** Envelope framing names, mapped to the single-byte AAD framing code. */
const FRAMING_CODE: Readonly<Record<string, number>> = { file: 1, field: 2, record: 3, stream: 4 }

/** Standard (symmetric) format identifiers, transcripted into the AAD. */
const STANDARD_FORMAT_ID: Readonly<Record<string, string>> = {
  file: 'WBEF1', field: 'WBEV1', record: 'WBER1', stream: 'WBES1',
}

/** Domain separator the AAD transcript starts with. */
const AAD_DOMAIN = Buffer.from('WB-AAD\0', 'ascii')

/** Scheme name of the symmetric envelope this module opens. */
const SYMMETRIC_SCHEME = 'sym-v1'

/** Env override pointing at the WorkBuddy desktop executable. */
export const WORKBUDDY_APP_EXECUTABLE_ENV = 'WORKBUDDY_APP_EXECUTABLE'

const KEY_FETCH_TIMEOUT_MS = 10_000

/** File names the WorkBuddy desktop executable goes by on Windows. */
const APP_EXECUTABLE_NAMES: readonly string[] = ['WorkBuddy.exe', 'WorkBuddyAI.exe']

/** Windows install directories (relative to %LOCALAPPDATA% / ProgramFiles). */
const WINDOWS_APP_SUBDIRECTORIES: readonly (readonly string[])[] = [
  ['Programs', 'WorkBuddy'],
  ['WorkBuddy'],
  ['Programs', 'WorkBuddyAI'],
  ['WorkBuddyAI'],
]

/** macOS bundles the desktop app may be installed as. */
const MACOS_APP_BUNDLE_NAMES: readonly string[] = ['WorkBuddy.app', 'WorkBuddy AI.app']

function encodeUint32(value: number): Buffer {
  const bytes = Buffer.allocUnsafe(4)
  bytes.writeUInt32BE(value)
  return bytes
}

function encodeLengthPrefixed(value: string): Buffer {
  const bytes = Buffer.from(value, 'utf8')
  return Buffer.concat([encodeUint32(bytes.length), bytes])
}

/** AAD for one `sym-v1` FIELD-framed envelope (the credential-field shape). */
function fieldAad(keyId: string, suite: number, scheme: string = SYMMETRIC_SCHEME): Buffer {
  if (!/^[0-9a-f]{16}$/u.test(keyId)) throw new Error('workbuddy: envelope keyId is malformed')
  return Buffer.concat([
    AAD_DOMAIN,
    Buffer.from([1]),
    encodeLengthPrefixed(STANDARD_FORMAT_ID['field']!),
    encodeLengthPrefixed(scheme),
    encodeUint32(suite),
    encodeLengthPrefixed(keyId),
    Buffer.from([FRAMING_CODE['field']!]),
    Buffer.from([0]), // no sequence in field framing
    Buffer.from([0]), // final === undefined
  ])
}

export function isEncryptedFieldWrapper(value: unknown): value is WorkBuddyEncryptedField {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const wrapper = value as Record<string, unknown>
  const keys = Object.keys(wrapper).sort()
  return keys.length === 2
    && keys[0] === '$wbEncrypted'
    && keys[1] === 'envelope'
    && wrapper['$wbEncrypted'] === 1
    && typeof wrapper['envelope'] === 'string'
}

/** Key id for a derived key: first 16 hex chars of its SHA-256. */
export function deriveAtRestKeyId(key: Buffer): string {
  return createHash('sha256').update(key).digest('hex').slice(0, 16)
}

/** Derive the 32-byte field key from the app's key payload JSON. */
export function deriveAtRestKey(payloadJson: string): Buffer {
  let payload: unknown
  try {
    payload = JSON.parse(payloadJson)
  } catch {
    throw new Error('workbuddy: at-rest key payload is not valid JSON')
  }
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('workbuddy: at-rest key payload is not an object')
  }
  const secret = (payload as Record<string, unknown>)['atRestSecretKey']
  if (typeof secret !== 'string' || secret === '') {
    throw new Error('workbuddy: at-rest key payload carries no atRestSecretKey')
  }
  return createHash('sha256').update(secret, 'utf8').digest()
}

/** Open one encrypted field; throws on tag mismatch or malformed envelope. */
export function openEncryptedField(field: WorkBuddyEncryptedField, key: Buffer): string {
  let envelope: unknown
  try {
    envelope = JSON.parse(Buffer.from(field.envelope, 'base64').toString('utf8'))
  } catch {
    throw new Error('workbuddy: encrypted field envelope is not valid JSON')
  }
  if (typeof envelope !== 'object' || envelope === null || Array.isArray(envelope)) {
    throw new Error('workbuddy: encrypted field envelope is not an object')
  }
  const record = envelope as Record<string, unknown>
  const suite = record['suite']
  const keyId = record['keyId']
  const nonce = record['nonce']
  const authTag = record['authTag']
  const ciphertext = record['ciphertext']
  if (typeof suite !== 'number' || typeof keyId !== 'string') {
    throw new Error('workbuddy: encrypted field envelope is missing suite or keyId')
  }
  if (typeof nonce !== 'string' || typeof authTag !== 'string' || typeof ciphertext !== 'string') {
    throw new Error('workbuddy: encrypted field envelope is missing nonce, authTag or ciphertext')
  }
  const expectedKeyId = deriveAtRestKeyId(key)
  if (keyId !== expectedKeyId) {
    throw new Error(`workbuddy: encrypted field belongs to key ${keyId}, not the available key ${expectedKeyId}`)
  }
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(nonce, 'base64'), { authTagLength: 16 })
  decipher.setAAD(fieldAad(keyId, suite))
  decipher.setAuthTag(Buffer.from(authTag, 'base64'))
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8')
}

/** The executable inside a macOS app bundle, from its own Info.plist. */
export function macosBundleExecutable(bundle: string): string | undefined {
  let plist: string
  try {
    plist = readFileSync(join(bundle, 'Contents', 'Info.plist'), 'utf8')
  } catch {
    return undefined
  }
  const match = /<key>CFBundleExecutable<\/key>\s*<string>([^<]+)<\/string>/u.exec(plist)
  const name = match?.[1]?.trim()
  if (name === undefined || name === '') return undefined
  const executable = join(bundle, 'Contents', 'MacOS', name)
  return existsSync(executable) ? executable : undefined
}

/** Registry DisplayIcon / InstallLocation → executable path, validated. */
export function normalizeRegistryExecutable(value: string): string | undefined {
  const unquoted = stripRegistryQuotes(value)
  if (unquoted === undefined || unquoted === '') return undefined
  const withoutIndex = unquoted.replace(/,\s*-?\d+\s*$/u, '')
  if (withoutIndex === '') return undefined
  const base = win32.basename(withoutIndex).toLowerCase()
  if (!APP_EXECUTABLE_NAMES.some(name => name.toLowerCase() === base)) return undefined
  return withoutIndex
}

function stripRegistryQuotes(value: string): string | undefined {
  const trimmed = value.trim()
  if (trimmed === '') return undefined
  if (!trimmed.startsWith('"')) return trimmed
  const closing = trimmed.indexOf('"', 1)
  if (closing === -1) return undefined
  return trimmed.slice(1, closing).trim()
}

/** Candidate paths of the desktop executable, in probe order. */
export function workbuddyAppExecutableCandidates(
  platform: NodeJS.Platform = process.platform,
  home: string = homedir(),
  env: NodeJS.ProcessEnv = process.env,
  readBundleExecutable: (bundle: string) => string | undefined = macosBundleExecutable,
): string[] {
  const candidates: (string | undefined)[] = [env[WORKBUDDY_APP_EXECUTABLE_ENV]?.trim()]
  if (platform === 'win32') {
    const local = env['LOCALAPPDATA']?.trim()
    const programFiles = env['ProgramFiles']?.trim()
    const programFilesX86 = env['ProgramFiles(x86)']?.trim()
    const bases = [local, programFiles, programFilesX86].filter(base => base !== undefined && base !== '')
    for (const base of bases) {
      for (const subdirectory of WINDOWS_APP_SUBDIRECTORIES) {
        for (const name of APP_EXECUTABLE_NAMES) {
          // `win32.join`, not the host's join: these are Windows paths by
          // construction and `path.join` follows the RUNNING platform.
          candidates.push(win32.join(base!, ...subdirectory, name))
        }
      }
    }
  } else if (platform === 'darwin') {
    for (const name of MACOS_APP_BUNDLE_NAMES) {
      candidates.push(
        readBundleExecutable(join('/Applications', name)),
        readBundleExecutable(join(home, 'Applications', name)),
      )
    }
  }
  return candidates.filter((candidate): candidate is string => candidate !== undefined && candidate !== '')
}

/** The first candidate that exists on disk, or undefined. */
export function findWorkbuddyAppExecutable(
  platform: NodeJS.Platform = process.platform,
  home: string = homedir(),
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  for (const candidate of workbuddyAppExecutableCandidates(platform, home, env)) {
    if (existsSync(candidate)) return candidate
  }
  return undefined
}

/** Ask the installed app for its key payload by running it as plain Node. */
export function fetchAtRestKeyPayload(executable: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const source = "try{process.stdout.write(process._linkedBinding('electron_browser_workbuddy_storage').loggerGet())}"
      + 'catch(e){process.exitCode=3;process.stderr.write(String(e&&e.message||e))}'
    execFile(
      executable,
      ['-e', source],
      {
        env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
        timeout: KEY_FETCH_TIMEOUT_MS,
        windowsHide: true,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error !== null) {
          reject(new Error(`workbuddy: the desktop app did not provide its at-rest key (${stderr.trim() || error.message})`))
          return
        }
        const payload = stdout.trim()
        if (payload === '') {
          reject(new Error('workbuddy: the desktop app returned an empty at-rest key payload'))
          return
        }
        resolve(payload)
      },
    )
  })
}

/** Process-lifetime cache of the derived key; never persisted. */
let cachedKey: Buffer | undefined
let inflightKey: Promise<Buffer | undefined> | undefined
let failedKeyAtMs = 0
/** How long a failed lookup is remembered (collapse repeated probes). */
const AT_REST_KEY_FAILURE_TTL_MS = 60_000

/**
 * The desktop app's at-rest field key, or undefined when it cannot be
 * obtained (app not installed, older build, rotated payload).
 */
export function readAtRestKey(): Promise<Buffer | undefined> {
  if (cachedKey !== undefined) return Promise.resolve(cachedKey)
  if (inflightKey !== undefined) return inflightKey
  if (failedKeyAtMs !== 0 && Date.now() - failedKeyAtMs < AT_REST_KEY_FAILURE_TTL_MS) {
    return Promise.resolve(undefined)
  }
  inflightKey = (async (): Promise<Buffer | undefined> => {
    const executable = findWorkbuddyAppExecutable()
    if (executable === undefined) return undefined
    const payload = await fetchAtRestKeyPayload(executable)
    return deriveAtRestKey(payload)
  })().then(key => {
    cachedKey = key
    failedKeyAtMs = key === undefined ? Date.now() : 0
    return key
  }, (error: unknown) => {
    // A thrown failure is cached on the same terms as an empty answer; the
    // error is rethrown so the caller's diagnosis keeps the app's wording.
    failedKeyAtMs = Date.now()
    throw error
  }).finally(() => {
    inflightKey = undefined
  })
  return inflightKey
}

/** Drop the cached key; diagnostics only. */
export function clearAtRestKeyCache(): void {
  cachedKey = undefined
  inflightKey = undefined
  failedKeyAtMs = 0
}
