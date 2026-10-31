/**
 * WorkBuddy request headers.
 *
 * The attribution group and SDK headers are copied from the desktop client's
 * observed wire behaviour. They matter beyond authentication: WorkBuddy uses
 * them to attribute the request to a client in its usage page.
 */

import type { WorkBuddyCredential } from './store.ts'
import { regionOf } from './upstream.ts'
import type { WorkBuddyRegion } from './upstream.ts'
import type { WorkBuddyWireIdentity } from './wire-identity.ts'
import { wireProfileFor } from './wire-profile.ts'
import { accountDomain, chatBase } from './wire-headers.ts'

export { chatBase }

const SDK_OS: Readonly<Record<string, string>> = {
  aix: 'AIX',
  android: 'Android',
  cygwin: 'Windows',
  darwin: 'MacOS',
  freebsd: 'FreeBSD',
  haiku: 'Haiku',
  linux: 'Linux',
  netbsd: 'NetBSD',
  openbsd: 'OpenBSD',
  sunos: 'SunOS',
  win32: 'Windows',
}

const SDK_ARCH: Readonly<Record<string, string>> = {
  arm: 'arm',
  arm64: 'arm64',
  ia32: 'x32',
  x32: 'x32',
  x64: 'x64',
}

function accountHeaders(credential: WorkBuddyCredential, region: WorkBuddyRegion): Record<string, string> {
  const enterpriseId = credential.enterpriseId?.trim() ?? ''
  return {
    'Authorization': `Bearer ${credential.accessToken}`,
    'X-User-Id': credential.uid,
    ...(enterpriseId === ''
      ? {}
      : {
          'X-Enterprise-Id': enterpriseId,
          'X-Tenant-Id': enterpriseId,
        }),
    'X-Domain': accountDomain(credential, region),
  }
}

function attributionHeaders(credential: WorkBuddyCredential): Record<string, string> {
  const profile = wireProfileFor(regionOf(credential.domain))
  return {
    'User-Agent': profile.userAgent,
    'X-Requested-With': 'XMLHttpRequest',
    'X-Product': 'SaaS',
    'X-IDE-Type': 'WorkBuddy',
    'X-IDE-Name': 'WorkBuddy',
    'X-IDE-Version': profile.appVersion,
    'X-Agent-Intent': 'craft',
    'X-Agent-Purpose': 'conversation',
  }
}

function modelRequestHeaders(credential: WorkBuddyCredential): Record<string, string> {
  const profile = wireProfileFor(regionOf(credential.domain))
  return {
    'X-Agent-Type': 'main',
    ...(profile.runtime === '' ? {} : { 'X-Agent-Runtime': profile.runtime }),
    'X-Stainless-Retry-Count': '0',
    'X-Stainless-Timeout': '1200',
    'X-Stainless-Lang': 'js',
    'X-Stainless-Package-Version': profile.openAISdkVersion,
    'X-Stainless-OS': SDK_OS[process.platform] ?? `Other:${process.platform}`,
    'X-Stainless-Arch': SDK_ARCH[process.arch] ?? `other:${process.arch}`,
    'X-Stainless-Runtime': 'node',
    'X-Stainless-Runtime-Version': profile.nodeVersion,
  }
}

/** Headers for a chat-completions or Anthropic Messages model request. */
export function workBuddyModelHeaders(
  credential: WorkBuddyCredential,
  identity: WorkBuddyWireIdentity,
): Record<string, string> {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...accountHeaders(credential, regionOf(credential.domain)),
    ...attributionHeaders(credential),
    ...modelRequestHeaders(credential),
    'X-Conversation-ID': identity.conversationId,
    'X-Conversation-Request-ID': identity.turnId,
    'X-Conversation-Message-ID': identity.messageId,
    'X-Request-ID': identity.requestId,
  }
}

/**
 * Config and other product requests carry client attribution but no chat turn
 * identity or OpenAI SDK headers.
 */
export function workBuddyCatalogHeaders(credential: WorkBuddyCredential): Record<string, string> {
  return {
    'Accept': 'application/json',
    ...accountHeaders(credential, regionOf(credential.domain)),
    ...attributionHeaders(credential),
  }
}
