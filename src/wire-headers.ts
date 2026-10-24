/**
 * Shared header helpers (kept dependency-light for lazy imports).
 */

import { randomUUID } from 'node:crypto'
import {
  CN_CHAT_BASE,
  CLIENT_UA,
  GLOBAL_BASE,
  GLOBAL_CODEBUDDY_BASE,
  originReferer as originOf,
  regionOf,
  globalBase as globalBaseOf,
} from './upstream.ts'

export { CN_CHAT_BASE, GLOBAL_BASE, GLOBAL_CODEBUDDY_BASE, CLIENT_UA, regionOf }

export function chatBase(credential: { domain: string }): string {
  return regionOf(credential.domain) === 'global' ? globalBaseOf(credential.domain) : CN_CHAT_BASE
}

export function originReferer(credential: { domain: string }): string {
  return originOf(credential)
}

export function globalBase(domain: string): string {
  return globalBaseOf(domain)
}

/** Fresh conversation-identity triple, generated per request. */
export function randomUUIDHeaders(): Record<string, string> {
  return {
    'X-Conversation-ID': randomUUID(),
    'X-Conversation-Request-ID': randomUUID(),
    'X-Conversation-Message-ID': randomUUID(),
  }
}
