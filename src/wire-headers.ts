/**
 * Shared gateway and identity header helpers.
 *
 * This module stays dependency-light so streaming code can import it without
 * pulling in the credential store or OAuth implementation.
 */

import type { WorkBuddyCredential } from './store.ts'
import {
  CN_CHAT_BASE,
  GLOBAL_BASE,
  GLOBAL_CODEBUDDY_BASE,
  globalBase,
  originReferer,
  regionOf,
} from './upstream.ts'
import type { WorkBuddyRegion } from './upstream.ts'
import { wireProfileFor } from './wire-profile.ts'

export {
  CN_CHAT_BASE,
  GLOBAL_BASE,
  GLOBAL_CODEBUDDY_BASE,
  globalBase,
  originReferer,
  regionOf,
}

export function chatBase(credential: { domain: string }): string {
  return regionOf(credential.domain) === 'global' ? globalBase(credential.domain) : CN_CHAT_BASE
}

export function userAgentFor(credential: { domain: string }): string {
  return wireProfileFor(regionOf(credential.domain)).userAgent
}

export function accountDomain(
  credential: Pick<WorkBuddyCredential, 'domain'>,
  region: WorkBuddyRegion,
): string {
  const stated = credential.domain.trim()
  if (stated !== '') return stated
  return new URL(region === 'global' ? GLOBAL_BASE : CN_CHAT_BASE).host
}
