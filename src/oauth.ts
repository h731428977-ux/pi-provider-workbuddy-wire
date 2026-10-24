/**
 * OAuth QR sign-in: add a WorkBuddy account by scanning a code, without the
 * desktop app.
 *
 * Flow (measured against the upstream's cockpit):
 *   1. POST `{base}/v2/plugin/auth/state?platform=workbuddy` → `{state, authUrl}`;
 *   2. the user opens the authorization URL in a browser and signs in;
 *   3. GET `{base}/v2/plugin/auth/token?state={state}` until it carries tokens;
 *   4. GET `{base}/v2/plugin/login/account` for the profile (display metadata;
 *      its absence must not fail a login whose tokens are already in hand).
 *
 * The login session is bound to region AND base and lives only in process
 * memory; a restart cancels it. The international product signs in through
 * either brand domain (`workbuddy.ai` / `codebuddy.ai`) — a token issued at
 * one domain is refused by the other, so the choice happens BEFORE the state
 * is issued.
 */

import { randomUUID } from 'node:crypto'
import { regionOf } from './upstream.ts'
import type { WorkBuddyRegion } from './upstream.ts'

const CN_BILLING_BASE = 'https://www.codebuddy.cn'
const GLOBAL_BILLING_BASE = 'https://www.workbuddy.ai'
const API_PREFIX = '/v2/plugin'

export const OAUTH_LOGIN_TIMEOUT_SECONDS = 600

/** The credential-shaped answer a finished login reports. */
export interface WorkBuddyOAuthSuccess {
  accessToken: string
  refreshToken: string
  expiresAtMs: number
  domain: string
  uid: string
  nickname?: string
  uin?: string
  enterpriseId?: string
}

export type WorkBuddyOAuthPollResult =
  | { done: false }
  | { done: true, account: WorkBuddyOAuthSuccess }
  | { done: true, error: string }

/** The base a login for `region` should start from. */
export function oauthBillingBase(region: WorkBuddyRegion, explicitBase?: string): string {
  if (region === 'cn') return CN_BILLING_BASE
  const trimmed = explicitBase?.trim()
  if (trimmed !== undefined && trimmed !== '') return trimmed.replace(/\/+$/, '')
  return GLOBAL_BILLING_BASE
}

interface LoginSession {
  region: WorkBuddyRegion
  base: string
  state: string
  expiresAtMs: number
  done: boolean
  result?: WorkBuddyOAuthSuccess
  error?: string
}

const sessions = new Map<string, LoginSession>()

async function readJson(response: Response): Promise<Record<string, unknown> | undefined> {
  try {
    const parsed: unknown = JSON.parse(await response.text())
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // fall through
  }
  return undefined
}

function envelopeData(document: Record<string, unknown>): Record<string, unknown> {
  const data = document['data']
  return typeof data === 'object' && data !== null && !Array.isArray(data)
    ? data as Record<string, unknown>
    : {}
}

function firstString(source: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return ''
}

function optionalString(source: Record<string, unknown>, keys: readonly string[]): string | undefined {
  const value = firstString(source, keys)
  return value === '' ? undefined : value
}

function expiryMs(
  source: Record<string, unknown>,
  absoluteKeys: readonly string[],
  ttlKeys: readonly string[],
): number | undefined {
  for (const key of absoluteKeys) {
    const value = source[key]
    if (typeof value === 'number' && value > 0) return value > 1e12 ? value : value * 1000
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
      const parsed = Number(value)
      return parsed > 1e12 ? parsed : parsed * 1000
    }
  }
  for (const key of ttlKeys) {
    const value = source[key]
    if (typeof value === 'number' && value > 0) return Date.now() + value * 1000
  }
  return undefined
}

/**
 * Start one login: ask the upstream for a state and return the URL the user
 * opens to scan/confirm. Never throws for an upstream refusal — the error
 * becomes the returned `error`.
 */
export async function oauthStart(
  region: WorkBuddyRegion,
  options?: { base?: string },
): Promise<{ loginId: string, verificationUri: string, expiresIn: number } | { error: string }> {
  const base = oauthBillingBase(region, options?.base)
  let response: Response
  try {
    response = await fetch(`${base}${API_PREFIX}/auth/state?platform=workbuddy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(30_000),
    })
  } catch (error) {
    return { error: `could not reach ${base} to start the sign-in (${error instanceof Error ? error.message : String(error)})` }
  }
  const document = await readJson(response)
  if (document === undefined) {
    return { error: `the sign-in service answered with a non-JSON body (http ${response.status})` }
  }
  const data = envelopeData(document)
  const state = firstString(data, ['state', 'State'])
  if (state === '') {
    return { error: `the sign-in service did not issue a state (http ${response.status})` }
  }
  const authUrl = firstString(data, ['authUrl', 'auth_url', 'url', 'Url'])
    || `${base}/login?state=${encodeURIComponent(state)}`
  const loginId = `wbo_${randomUUID().replaceAll('-', '')}`
  sessions.set(loginId, {
    region,
    base,
    state,
    expiresAtMs: Date.now() + OAUTH_LOGIN_TIMEOUT_SECONDS * 1000,
    done: false,
  })
  return { loginId, verificationUri: authUrl, expiresIn: OAUTH_LOGIN_TIMEOUT_SECONDS }
}

/** Poll once for a login's outcome. `done` is the only stop signal. */
export async function oauthPoll(loginId: string, region: WorkBuddyRegion): Promise<WorkBuddyOAuthPollResult> {
  const session = sessions.get(loginId)
  if (session === undefined) return { done: true, error: 'sign-in session not found; start a new one' }
  if (session.region !== region) return { done: true, error: 'sign-in session belongs to another region' }
  if (session.done) return terminalOf(session)
  if (Date.now() > session.expiresAtMs) {
    sessions.delete(loginId)
    return { done: true, error: 'the sign-in timed out; start again' }
  }

  let response: Response
  try {
    response = await fetch(`${session.base}${API_PREFIX}/auth/token?state=${encodeURIComponent(session.state)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(30_000),
    })
  } catch {
    // A transport blip is not a dead login: the user may still be scanning.
    return { done: false }
  }
  const document = await readJson(response)
  if (document === undefined) return { done: false }
  const code = typeof document['code'] === 'number' ? document['code'] : -1
  if (code !== 0 && code !== 200) return { done: false }
  const data = envelopeData(document)
  const accessToken = firstString(data, ['accessToken', 'access_token', 'AccessToken'])
  if (accessToken === '') return { done: false }

  session.done = true
  try {
    const account = await collectAccount(session, accessToken, data)
    sessions.delete(loginId)
    return { done: true, account }
  } catch (error) {
    sessions.delete(loginId)
    return { done: true, error: error instanceof Error ? error.message : String(error) }
  }
}

function terminalOf(session: LoginSession): WorkBuddyOAuthPollResult {
  if (session.result !== undefined) return { done: true, account: session.result }
  return { done: true, error: session.error ?? 'the sign-in ended without a result' }
}

async function collectAccount(
  session: LoginSession,
  accessToken: string,
  tokenData: Record<string, unknown>,
): Promise<WorkBuddyOAuthSuccess> {
  const headers: Record<string, string> = { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
  const domain = firstString(tokenData, ['domain', 'Domain'])
  if (domain !== '') headers['X-Domain'] = domain
  let profile: Record<string, unknown> = {}
  try {
    const response = await fetch(`${session.base}${API_PREFIX}/login/account`, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(30_000),
    })
    const document = await readJson(response)
    if (document !== undefined) profile = envelopeData(document)
  } catch {
    // Display metadata; its absence must not fail a login already in hand.
  }
  const refresh = firstString(tokenData, ['refreshToken', 'refresh_token', 'RefreshToken'])
  return {
    accessToken,
    refreshToken: refresh,
    expiresAtMs: expiryMs(tokenData, ['expiresAt', 'expires_at'], ['expiresIn', 'expires_in']) ?? 0,
    // The token's own domain comes first: it decides which gateway accepts
    // this credential. The profile echo is only a fallback.
    domain: domain !== '' ? domain : firstString(profile, ['domain', 'Domain']),
    uid: firstString(profile, ['uid', 'Uid', 'userId', 'UserID']),
    ...optionalString(profile, ['nickname', 'NickName', 'ScreenName']) === undefined ? {} : { nickname: optionalString(profile, ['nickname', 'NickName', 'ScreenName'])! },
    ...optionalString(profile, ['uin', 'Uin']) === undefined ? {} : { uin: optionalString(profile, ['uin', 'Uin'])! },
    ...optionalString(profile, ['enterpriseId', 'EnterpriseId']) === undefined ? {} : { enterpriseId: optionalString(profile, ['enterpriseId', 'EnterpriseId'])! },
  }
}

/** Region a finished login's credential belongs to. */
export function regionOfOAuthAccount(account: Pick<WorkBuddyOAuthSuccess, 'domain'>): WorkBuddyRegion {
  return regionOf(account.domain)
}
