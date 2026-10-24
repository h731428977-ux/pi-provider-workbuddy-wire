/**
 * Wire header assembly for chat requests, split out so the stream module can
 * import it lazily without a cycle through the client.
 */

import type { WorkBuddyCredential } from './store.ts'
import { chatBase, CLIENT_UA, originReferer, regionOf, globalBase, randomUUIDHeaders } from './wire-headers.ts'

export { chatBase }

export function chatHeadersFor(credential: WorkBuddyCredential): Record<string, string> {
  return {
    'Accept': 'text/event-stream',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${credential.accessToken}`,
    'User-Agent': CLIENT_UA,
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': originReferer(credential),
    'Referer': `${originReferer(credential)}/`,
    ...(credential.uid === '' ? { 'X-No-User-Id': '1' } : { 'X-User-Id': credential.uid }),
    ...(credential.enterpriseId === undefined || credential.enterpriseId === ''
      ? { 'X-No-Enterprise-Id': '1' }
      : { 'X-Enterprise-Id': credential.enterpriseId }),
    ...(credential.domain === '' ? { 'X-No-Department-Info': '1' } : { 'X-Domain': credential.domain }),
    'X-Product': 'SaaS',
    ...randomUUIDHeaders(),
  }
}

export function upstreamBaseFor(credential: WorkBuddyCredential): string {
  return regionOf(credential.domain) === 'global' ? globalBase(credential.domain) : chatBase(credential)
}
