/**
 * Credential store: resolves the credential a request should use for one
 * region, refreshing expired tokens through the upstream refresh endpoint.
 *
 * Source precedence (fresher wins):
 *   1. the plugin's own refreshed copy — a token the plugin refreshed is
 *      strictly newer than what the app last wrote, and re-reading the live
 *      file would resurrect the stale copy every restart;
 *   2. the desktop app's live auth file — the app's current sign-in;
 *   3. OAuth vault accounts — explicit sign-ins, selectable via /login.
 *
 * Security red line: the chat path NEVER carries the refresh token. The
 * refresh endpoint's `X-Refresh-Token` header is the only place it travels.
 */

import {
  readDesktopCredential,
  readOwnCredential,
  readVaultAccounts,
  saveOwnCredential,
  saveVaultAccount,
  type ReadCredentialResult,
  type WorkBuddyCredential,
} from './auth.ts'
import { CHAT_PATH, chatBase, JSON_TIMEOUT_MS, REFRESH_PATH, regionOf } from './upstream.ts'
import type { WorkBuddyRegion } from './upstream.ts'
import { readAtRestKey } from './at-rest.ts'

export interface WorkBuddyAuthStatus {
  region: WorkBuddyRegion
  /** True when a usable credential is available. */
  signedIn: boolean
  label?: string
  /** Epoch ms the access token expires; 0 = unknown. */
  expiresAtMs?: number
  source?: WorkBuddyCredential['source']
  /** Skipped candidate paths with reasons (diagnostics, no secrets). */
  candidates: ReadCredentialResult['candidates']
}

/** Envelope of the refresh endpoint answer. */
interface WorkBuddyRefreshOutcome {
  accessToken: string
  refreshToken?: string
  expiresInSec?: number
  domain?: string
}

export class WorkBuddyCredentialStore {
  /** Cache of the last resolved credential, keyed by region. */
  private readonly resolved = new Map<WorkBuddyRegion, WorkBuddyCredential>()

  constructor(
    private readonly region: WorkBuddyRegion,
    private readonly log?: (message: string) => void,
  ) {}

  getRegion(): WorkBuddyRegion {
    return this.region
  }

  /**
   * Resolve the credential for the next request, refreshing when the token
   * is expired (or has no stated expiry and was never refreshed). Throws a
   * plain Error with the actionable advice when nothing usable exists.
   */
  async resolve(): Promise<WorkBuddyCredential> {
    const cached = this.resolved.get(this.region)
    if (cached !== undefined && !this.needsRefresh(cached)) return cached

    const own = readOwnCredential(this.region)
    const desktop = await this.readDesktop()
    const vault = readVaultAccounts(this.region)

    // Best source: plugin copy > desktop live file > most recent vault entry.
    const best = this.pickBest(own, desktop, vault)
    if (best === undefined) {
      throw new Error(
        `workbuddy ${this.region}: no usable credential. Sign in to the WorkBuddy desktop app `
        + `(or run /login workbuddy${this.region === 'global' ? '-global' : ''}), then retry.`,
      )
    }

    let credential = best
    if (this.needsRefresh(credential) && credential.refreshToken !== '') {
      try {
        credential = await this.refresh(credential)
        saveOwnCredential(this.region, credential)
      } catch (error) {
        this.log?.(`workbuddy ${this.region}: token refresh failed: ${String(error)}`)
        // An expired token with a failed refresh is still worth trying once —
        // some gateways answer 200 past the stated expiry.
        if (credential.expiresAtMs !== 0 && credential.expiresAtMs <= Date.now()) {
          throw error
        }
      }
    }

    this.resolved.set(this.region, credential)
    return credential
  }

  /** Current status, without network I/O (reads the at-rest key lazily). */
  async status(): Promise<WorkBuddyAuthStatus> {
    const desktop = await this.readDesktop()
    const own = readOwnCredential(this.region)
    const vault = readVaultAccounts(this.region)
    const best = this.pickBest(own, desktop, vault)
    return {
      region: this.region,
      signedIn: best !== undefined,
      ...best === undefined ? {} : {
        label: best.nickname ?? best.displayName ?? best.uid,
        expiresAtMs: best.expiresAtMs,
        source: best.source,
      },
      candidates: desktop.candidates,
    }
  }

  /** Invalidate the cached resolution (after a credential rejection). */
  invalidate(): void {
    this.resolved.delete(this.region)
  }

  /** Run the OAuth flow's collected account through the vault + selection. */
  acceptOAuthCredential(credential: WorkBuddyCredential): string {
    const accountId = saveVaultAccount(this.region, credential)
    this.resolved.set(this.region, credential)
    return accountId
  }

  private needsRefresh(credential: WorkBuddyCredential): boolean {
    if (credential.refreshToken === '') return false
    if (credential.expiresAtMs === 0) return true
    // Refresh a minute early; clock skew should not produce a 401.
    return credential.expiresAtMs <= Date.now() + 60_000
  }

  private async readDesktop(): Promise<ReadCredentialResult> {
    let openField: ((value: unknown) => string | undefined) | undefined
    try {
      const key = await readAtRestKey()
      if (key !== undefined) {
        const { isEncryptedFieldWrapper, openEncryptedField } = await import('./at-rest.ts')
        openField = (value: unknown): string | undefined => {
          if (typeof value === 'string') return value === '' ? undefined : value
          if (!isEncryptedFieldWrapper(value)) return undefined
          try {
            return openEncryptedField(value, key)
          } catch {
            return undefined
          }
        }
      }
    } catch {
      // No key — encrypted files will be reported as unreadable.
    }
    return readDesktopCredential(this.region, openField)
  }

  /** Best of the available sources; the desktop live file wins ties only on rank. */
  private pickBest(
    own: WorkBuddyCredential | undefined,
    desktop: ReadCredentialResult | undefined,
    vault: Map<string, WorkBuddyCredential>,
  ): WorkBuddyCredential | undefined {
    const candidates: WorkBuddyCredential[] = []
    if (own !== undefined) candidates.push({ ...own, source: 'plugin' })
    if (desktop?.credential !== undefined) candidates.push(desktop.credential)
    candidates.push(...vault.values())
    if (candidates.length === 0) return undefined
    // Rank: plugin refreshed copy first (strictly newer than the app's write),
    // then the desktop live file, then whichever vault entry has the token
    // furthest from expiry. RefreshedAt ordering inside one source is not
    // tracked; expiry is the tie-breaker, never the primary signal (a revoked
    // backup keeps a far-future expiresAt — the live file wins by RANK).
    const rank: Record<WorkBuddyCredential['source'], number> = { plugin: 0, desktop: 1, oauth: 2, env: 3 }
    return candidates.sort((a, b) => rank[a.source] - rank[b.source]
      || b.expiresAtMs - a.expiresAtMs)[0]
  }

  /**
   * POST the refresh endpoint. The refresh token travels here and NOWHERE
   * else; chat requests never see it.
   */
  private async refresh(credential: WorkBuddyCredential): Promise<WorkBuddyCredential> {
    const headers: Record<string, string> = {
      'Accept': 'application/json, text/plain, */*',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Refresh-Token': credential.refreshToken,
      'X-Auth-Refresh-Source': 'workbuddy',
    }
    if (credential.enterpriseId !== undefined && credential.enterpriseId !== '') {
      headers['X-Enterprise-Id'] = credential.enterpriseId
    }
    const response = await fetch(`${chatBase(credential)}${REFRESH_PATH}`, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(JSON_TIMEOUT_MS),
    })
    const text = await response.text()
    let envelope: Record<string, unknown>
    try {
      envelope = JSON.parse(text) as Record<string, unknown>
    } catch {
      throw new Error(`workbuddy token refresh returned non-JSON (http ${response.status})`)
    }
    const code = typeof envelope['code'] === 'number' ? envelope['code'] : 0
    if (!response.ok || code !== 0) {
      throw new Error(`workbuddy token refresh failed (http ${response.status}): ${text.slice(0, 160)}`)
    }
    const data = typeof envelope['data'] === 'object' && envelope['data'] !== null
      ? envelope['data'] as Record<string, unknown>
      : {}
    const accessToken = typeof data['accessToken'] === 'string' ? data['accessToken'] : ''
    if (accessToken === '') {
      throw new Error('workbuddy token refresh returned no accessToken; sign in again in the WorkBuddy app')
    }
    const expiresIn = typeof data['expiresIn'] === 'number' && data['expiresIn'] > 0 ? data['expiresIn'] : undefined
    return {
      ...credential,
      accessToken,
      ...(typeof data['refreshToken'] === 'string' && data['refreshToken'] !== ''
        ? { refreshToken: data['refreshToken'] as string }
        : {}),
      expiresAtMs: expiresIn !== undefined ? Date.now() + expiresIn * 1000 : credential.expiresAtMs,
      ...(typeof data['domain'] === 'string' && data['domain'] !== ''
        ? { domain: data['domain'] as string }
        : {}),
      source: 'plugin',
    }
  }
}

/**
 * The model catalog entry the upstream publishes, parsed from `/v3/config`
 * (and the legacy `/v2` CN fallback). Fields the parser cannot read stay
 * undefined rather than guessed.
 */
export interface WorkBuddyUpstreamModel {
  id: string
  name: string
  contextWindow: number
  maxTokens: number
  /** Credit multiplier parsed from the upstream `credits` string. */
  creditMultiplier?: number
  supportsImages?: boolean
  reasoning?: {
    supportedEfforts?: string[]
    defaultEffort?: string
    canDisableThinking?: boolean
  }
}

/**
 * Parse the upstream's `credits` string into a multiplier. Observed forms:
 * `"x0.79 credits"`, `"x0.05"`, `"x0.00 credits"`, absent. Unparsable values
 * yield undefined rather than a guess.
 */
export function parseCreditMultiplier(value: unknown): number | undefined {
  if (typeof value !== 'string') return undefined
  const match = /x\s*([0-9]*\.?[0-9]+)/iu.exec(value)
  if (match === null) return undefined
  const parsed = Number(match[1])
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

/**
 * The effort vocabulary the upstream declares (live union across gateways).
 * Singular-form `effort` models fold into the full ladder.
 */
const SINGULAR_EFFORT_LADDER = ['low', 'medium', 'high', 'xhigh', 'max'] as const

function parseReasoning(value: unknown): WorkBuddyUpstreamModel['reasoning'] | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined
  const raw = value as Record<string, unknown>
  const effort = typeof raw['effort'] === 'string' ? raw['effort'] : undefined
  const supportedEfforts = Array.isArray(raw['supportedEfforts'])
    ? raw['supportedEfforts'].filter((entry): entry is string => typeof entry === 'string')
    : effort !== undefined
      ? ((SINGULAR_EFFORT_LADDER as readonly string[]).includes(effort) ? [...SINGULAR_EFFORT_LADDER] : [effort])
      : undefined
  const defaultEffort = typeof raw['defaultEffort'] === 'string' ? raw['defaultEffort'] : effort
  const canDisableThinking = typeof raw['canDisableThinking'] === 'boolean'
    ? raw['canDisableThinking']
    : (effort !== undefined && !Array.isArray(raw['supportedEfforts']) && typeof raw['defaultEffort'] !== 'string')
      ? true
      : undefined
  if (supportedEfforts === undefined && defaultEffort === undefined && canDisableThinking === undefined) {
    return undefined
  }
  return {
    ...(supportedEfforts === undefined || supportedEfforts.length === 0 ? {} : { supportedEfforts }),
    ...(defaultEffort === undefined ? {} : { defaultEffort }),
    ...(canDisableThinking === undefined ? {} : { canDisableThinking }),
  }
}

/** Ids the upstream lists that are ROUTERS, not models. */
const ROUTER_MODEL_IDS: ReadonlySet<string> = new Set(['auto', 'default-model'])

/** Parse one catalog entry; entries without usable token limits are dropped. */
export function parseUpstreamModel(value: unknown): WorkBuddyUpstreamModel | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const raw = value as Record<string, unknown>
  const id = typeof raw['id'] === 'string' ? raw['id'] : ''
  if (id === '' || raw['disabled'] === true) return undefined
  const input = typeof raw['maxInputTokens'] === 'number' ? raw['maxInputTokens'] : 0
  const output = typeof raw['maxOutputTokens'] === 'number' ? raw['maxOutputTokens'] : 0
  if (input <= 0 || output <= 0) return undefined
  const name = typeof raw['name'] === 'string' && raw['name'] !== '' ? raw['name'] : id
  const creditMultiplier = parseCreditMultiplier(raw['credits'])
  const reasoning = parseReasoning(raw['reasoning'])
  // `disabledMultimodal: true` is a hard veto on the platform's supportsImages.
  const supportsImages = raw['disabledMultimodal'] === true
    ? false
    : typeof raw['supportsImages'] === 'boolean' ? raw['supportsImages'] : undefined
  return {
    id,
    name,
    contextWindow: input,
    maxTokens: output,
    ...(creditMultiplier === undefined ? {} : { creditMultiplier }),
    ...(supportsImages === undefined ? {} : { supportsImages }),
    ...(reasoning === undefined ? {} : { reasoning }),
  }
}

/** Select the chat-capable models from a catalog document, in roster order. */
export function selectCliModels(rawModels: unknown, agents: unknown): WorkBuddyUpstreamModel[] {
  const byId = new Map<string, WorkBuddyUpstreamModel>()
  for (const model of Array.isArray(rawModels) ? rawModels : []) {
    const parsed = parseUpstreamModel(model)
    if (parsed !== undefined) byId.set(parsed.id, parsed)
  }
  let cliIds: readonly string[] | undefined
  for (const agent of Array.isArray(agents) ? agents : []) {
    if (typeof agent === 'object' && agent !== null) {
      const wrapped = agent as Record<string, unknown>
      if (wrapped['name'] === 'cli' && Array.isArray(wrapped['models'])) {
        cliIds = wrapped['models'].filter((id): id is string => typeof id === 'string')
        break
      }
    }
  }
  const ids = cliIds !== undefined && cliIds.length > 0 ? cliIds : [...byId.keys()]
  return ids
    .filter(id => !ROUTER_MODEL_IDS.has(id))
    .map(id => byId.get(id))
    .filter((model): model is WorkBuddyUpstreamModel => model !== undefined)
}

export interface WorkBuddyCredits {
  total: number
  packages: ReadonlyArray<{ packageName: string, remain: number, size: number, monthly: boolean, refreshAtMs?: number, expiresAtMs?: number }>
  expiringSoon: number
  nearestExpiryMs?: number
}

export { CHAT_PATH, regionOf }
export type { WorkBuddyCredential, WorkBuddyRegion }
