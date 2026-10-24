/**
 * Credentials: the WorkBuddy desktop app's auth file (read-only), the
 * plugin's own refreshed copies, and the OAuth vault.
 *
 * Measured shapes (from dsh-connect-workbuddy's live取证):
 *
 * - Desktop live file: `<CodeBuddyExtension>/Data/Public/auth/workbuddy-desktop.info`,
 *   in `{auth:{accessToken,refreshToken,expiresAt,domain}, account:{uid,...}}`
 *   nested form or the flat panel form. Timestamped backups sit beside it and
 *   their tokens are REVOKED upstream even when `expiresAt` is in the future —
 *   the live file always wins.
 * - Windows builds from 5.6.0 encrypt `accessToken` / `refreshToken` (and
 *   `nickname`) as `{"$wbEncrypted":1,"envelope":"…"}` AES-256-GCM envelopes
 *   keyed by a build-time constant inside the app's own native module. The key
 *   is obtained by asking the app itself (see `at-rest.ts`); without it the
 *   document is reported as unreadable, never half-decrypted.
 * - Plugin-owned refreshed copies live under the plugin data dir, one file per
 *   region so two simultaneously signed-in regions never overwrite each other.
 * - The OAuth vault holds one file per account, named by the account's stable id.
 */

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { regionOf } from './upstream.ts'
import type { WorkBuddyRegion } from './upstream.ts'

/** One WorkBuddy credential, whatever file it came from. */
export interface WorkBuddyCredential {
  accessToken: string
  refreshToken: string
  /** Epoch ms; 0 = the upstream did not state an expiry. */
  expiresAtMs: number
  /** The login domain — decides region AND which global gateway accepts it. */
  domain: string
  uid: string
  enterpriseId?: string
  nickname?: string
  displayName?: string
  uin?: string
  /** Where this credential was read from (diagnostics only). */
  source: 'desktop' | 'plugin' | 'oauth' | 'env'
  /** File this credential was read from (diagnostics only; never logged). */
  filePath?: string
}

/** Basename of the live WorkBuddy desktop auth file. */
const WORKBUDDY_LIVE_FILENAME = 'workbuddy-desktop.info'

/** Env variable that overrides the desktop auth-file location. */
export const WORKBUDDY_AUTH_FILE_ENV = 'WORKBUDDY_AUTH_FILE'

/** Env variable that overrides the plugin credential file location. */
export const WORKBUDDY_PLUGIN_AUTH_ENV = 'WORKBUDDY_PLUGIN_AUTH_FILE'

/** Platform-default directories holding the desktop app's auth file. */
export function defaultDesktopAuthDirs(
  platform: NodeJS.Platform = process.platform,
  home: string = homedir(),
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  if (platform === 'darwin') {
    return [join(home, 'Library', 'Application Support', 'CodeBuddyExtension', 'Data', 'Public', 'auth')]
  }
  if (platform === 'win32') {
    const local = nonEmpty(env['LOCALAPPDATA']) ?? join(home, 'AppData', 'Local')
    const roaming = nonEmpty(env['APPDATA']) ?? join(home, 'AppData', 'Roaming')
    return [
      join(local, 'CodeBuddyExtension', 'Data', 'Public', 'auth'),
      join(roaming, 'CodeBuddyExtension', 'Data', 'Public', 'auth'),
    ]
  }
  if (platform === 'linux') {
    const config = nonEmpty(env['XDG_CONFIG_HOME']) ?? join(home, '.config')
    return [join(config, 'CodeBuddyExtension', 'Data', 'Public', 'auth')]
  }
  return []
}

/** The live auth file's platform candidates, in probe order. */
export function defaultDesktopAuthCandidates(): string[] {
  return defaultDesktopAuthDirs().map(dir => join(dir, WORKBUDDY_LIVE_FILENAME))
}

/** Normalize an expiry that may arrive in seconds or milliseconds. */
export function expiryToMs(value: number): number {
  if (value <= 0) return 0
  return value > 1e12 ? value : value * 1000
}

function nonEmpty(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
}

/**
 * Stable account id derived from `uin` (or `uid` when uin is absent).
 * Never the raw identifier: `uin`/`uid` are opaque and may leak into logs.
 */
export function workbuddyAccountId(credential: Pick<WorkBuddyCredential, 'uin' | 'uid'>): string {
  const basis = credential.uin !== undefined && credential.uin !== '' ? credential.uin : credential.uid
  return createHash('sha256').update(basis).digest('hex').slice(0, 16)
}

/** Account display name: nickname first, then masked identifiers. */
export function workbuddyAccountLabel(credential: Pick<WorkBuddyCredential, 'nickname' | 'displayName' | 'uin' | 'uid'>): string {
  const name = credential.nickname ?? credential.displayName
  if (name !== undefined && name !== '') return name
  const basis = credential.uin !== undefined && credential.uin !== '' ? credential.uin : credential.uid
  if (basis === undefined || basis === '') return '(unknown)'
  return basis.length <= 4 ? basis : `${basis.slice(0, 2)}***${basis.slice(-2)}`
}

/**
 * Parse a WorkBuddy auth document in either on-disk shape. Returns undefined
 * when the document carries no usable access token. Encrypted fields are
 * handled by the caller-supplied key (see `at-rest.ts`); when the key is
 * undefined an encrypted token resolves to undefined — "unreadable", never a
 * fabricated value.
 */
export function parseWorkBuddyAuth(
  text: string,
  source: WorkBuddyCredential['source'],
  filePath: string,
  openField?: (value: unknown) => string | undefined,
): WorkBuddyCredential | undefined {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return undefined
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return undefined
  const document = parsed as Record<string, unknown>
  let auth: Record<string, unknown>
  let identity: Record<string, unknown>
  if (typeof document['auth'] === 'object' && document['auth'] !== null) {
    auth = document['auth'] as Record<string, unknown>
    identity = typeof document['account'] === 'object' && document['account'] !== null
      ? document['account'] as Record<string, unknown>
      : {}
  } else {
    auth = document
    identity = document
  }
  const accessToken = openField !== undefined ? openField(auth['accessToken']) : asString(auth['accessToken'])
  const refreshToken = openField !== undefined ? openField(auth['refreshToken']) : asString(auth['refreshToken'])
  if (accessToken === undefined || accessToken === '') return undefined
  const expiresAtMs = typeof auth['expiresAt'] === 'number' ? expiryToMs(auth['expiresAt']) : 0
  return {
    accessToken,
    refreshToken: refreshToken ?? '',
    expiresAtMs,
    domain: (openField !== undefined ? openField(auth['domain']) : asString(auth['domain'])) ?? '',
    uid: (openField !== undefined ? openField(identity['uid']) : asString(identity['uid'])) ?? '',
    ...optionalField('enterpriseId', openField !== undefined ? openField(identity['enterpriseId']) : asString(identity['enterpriseId'])),
    ...optionalField('nickname', openField !== undefined ? openField(identity['nickname']) : asString(identity['nickname'])),
    ...optionalField('displayName', openField !== undefined ? openField(identity['displayName']) : asString(identity['displayName'])),
    ...optionalField('uin', openField !== undefined ? openField(identity['uin']) : asString(identity['uin'])),
    source,
    filePath,
  }
}

function asString(value: unknown): string | undefined {
  if (typeof value !== 'string' || value === '') return undefined
  return value
}

function optionalField(key: string, value: string | undefined): Record<string, string> {
  return value === undefined ? {} : { [key]: value }
}

/**
 * Every credential file the plugin knows about for one region, ranked: the
 * desktop live file first (its token is the only one guaranteed unrevoked),
 * then the plugin's own refreshed copy, then backups by recency of lastRefresh.
 */
export function desktopAuthCandidates(env: NodeJS.ProcessEnv = process.env): string[] {
  const fromEnv = nonEmpty(env[WORKBUDDY_AUTH_FILE_ENV])
  if (fromEnv !== undefined) return [fromEnv]
  return defaultDesktopAuthCandidates()
}

export interface ReadCredentialResult {
  credential?: WorkBuddyCredential
  /** Why a candidate was skipped (diagnostics only, no secrets). */
  candidates: Array<{ path: string, reason: string }>
}

/**
 * Read the best available credential for one region from the desktop app's
 * auth directory. The desktop file is READ-ONLY — refresh results go to the
 * plugin's own file, never back to the app.
 */
export function readDesktopCredential(
  region: WorkBuddyRegion,
  openField?: (value: unknown) => string | undefined,
  env: NodeJS.ProcessEnv = process.env,
): ReadCredentialResult {
  const candidates = desktopAuthCandidates(env)
  const skipped: ReadCredentialResult['candidates'] = []
  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      skipped.push({ path: filePath, reason: '不存在' })
      continue
    }
    let text: string
    try {
      text = readFileSync(filePath, 'utf8')
    } catch (error) {
      skipped.push({ path: filePath, reason: `读不了: ${String(error)}` })
      continue
    }
    const credential = parseWorkBuddyAuth(text, 'desktop', filePath, openField)
    if (credential === undefined) {
      const encrypted = text.includes('$wbEncrypted')
      skipped.push({
        path: filePath,
        reason: encrypted && openField === undefined
          ? '字段已加密且拿不到密钥（需要已安装的 WorkBuddy 桌面端）'
          : '没有可用 token',
      })
      continue
    }
    const credentialRegion = regionOf(credential.domain)
    if (credentialRegion !== region) {
      skipped.push({ path: filePath, reason: `属于另一个地区（${credentialRegion === 'global' ? '国际版' : '国内版'}）` })
      continue
    }
    return { credential, candidates: skipped }
  }
  return { candidates: skipped }
}

// ---------------------------------------------------------------------------
// Plugin-owned credential store (refreshed tokens + OAuth vault)
// ---------------------------------------------------------------------------

/**
 * The plugin's own data directory. Under pi's agent dir by default so it
 * survives across sessions; `WORKBUDDY_PLUGIN_AUTH_ENV` overrides the single
 * credential file for portable setups.
 */
export function pluginDataDir(): string {
  const override = nonEmpty(process.env['WORKBUDDY_PLUGIN_DATA_DIR'])
  if (override !== undefined) return override
  const piDir = nonEmpty(process.env['PI_CODING_AGENT_DIR']) ?? join(homedir(), '.pi', 'agent')
  return join(piDir, 'workbuddy')
}

function ownAuthPath(region: WorkBuddyRegion): string {
  const override = nonEmpty(process.env[WORKBUDDY_PLUGIN_AUTH_ENV])
  if (override !== undefined) return override
  return join(pluginDataDir(), `auth.${region}.json`)
}

function vaultDir(region: WorkBuddyRegion): string {
  return join(pluginDataDir(), 'workbuddy-vault', region)
}

/** Serialize a credential to the plugin's on-disk document (nested form). */
function serializeCredential(credential: WorkBuddyCredential, accountKey: string): string {
  return JSON.stringify({
    format: 1,
    accountId: accountKey,
    auth: {
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      expiresAt: credential.expiresAtMs,
      domain: credential.domain,
    },
    account: {
      uid: credential.uid,
      ...optionalField('enterpriseId', credential.enterpriseId),
      ...optionalField('nickname', credential.nickname),
      ...optionalField('displayName', credential.displayName),
      ...optionalField('uin', credential.uin),
    },
  }, null, 2)
}

/**
 * Write the plugin's refreshed copy for one region, atomically enough for a
 * credential file: write-then-rename inside the plugin's own directory.
 */
export function saveOwnCredential(region: WorkBuddyRegion, credential: WorkBuddyCredential): void {
  const filePath = ownAuthPath(region)
  try {
    mkdirSync(join(filePath, '..'), { recursive: true })
  } catch {
    // An unwritable data dir is reported by the caller's error, not here.
  }
  const tmp = `${filePath}.tmp`
  writeFileSync(tmp, serializeCredential(credential, workbuddyAccountId(credential)), 'utf8')
  try {
    renameSync(tmp, filePath)
  } catch {
    writeFileSync(filePath, serializeCredential(credential, workbuddyAccountId(credential)), 'utf8')
  }
}

/** Read the plugin's own refreshed copy for one region. */
export function readOwnCredential(region: WorkBuddyRegion): WorkBuddyCredential | undefined {
  const filePath = ownAuthPath(region)
  if (!existsSync(filePath)) return undefined
  try {
    return parseWorkBuddyAuth(readFileSync(filePath, 'utf8'), 'plugin', filePath)
  } catch {
    return undefined
  }
}

/** Read one vault account file. */
function readVaultAccount(region: WorkBuddyRegion, fileName: string): WorkBuddyCredential | undefined {
  const filePath = join(vaultDir(region), fileName)
  try {
    return parseWorkBuddyAuth(readFileSync(filePath, 'utf8'), 'oauth', filePath)
  } catch {
    return undefined
  }
}

/** Every account in the OAuth vault for one region, keyed by account id. */
export function readVaultAccounts(region: WorkBuddyRegion): Map<string, WorkBuddyCredential> {
  const accounts = new Map<string, WorkBuddyCredential>()
  const dir = vaultDir(region)
  if (!existsSync(dir)) return accounts
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return accounts
  }
  for (const fileName of entries) {
    if (!fileName.endsWith('.json')) continue
    const credential = readVaultAccount(region, fileName)
    if (credential === undefined) continue
    accounts.set(workbuddyAccountId(credential), credential)
  }
  return accounts
}

/** Persist one OAuth-signed-in account into the vault (one file per account). */
export function saveVaultAccount(region: WorkBuddyRegion, credential: WorkBuddyCredential): string {
  const accountId = workbuddyAccountId(credential)
  mkdirSync(vaultDir(region), { recursive: true })
  writeFileSync(join(vaultDir(region), `${accountId}.json`), serializeCredential(credential, accountId), 'utf8')
  return accountId
}

/** Delete one vault account; returns whether a file was removed. */
export function deleteVaultAccount(region: WorkBuddyRegion, accountId: string): boolean {
  const filePath = join(vaultDir(region), `${accountId}.json`)
  if (!existsSync(filePath)) return false
  try {
    unlinkSync(filePath)
    return true
  } catch {
    return false
  }
}
