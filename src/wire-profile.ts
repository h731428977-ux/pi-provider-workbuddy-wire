/**
 * WorkBuddy desktop-client wire profile.
 *
 * The values in this file describe the client WorkBuddy's backend expects to
 * see. They are intentionally isolated from the Pi provider code so a desktop
 * app update can be handled by changing one profile instead of every request.
 */

import type { WorkBuddyRegion } from './upstream.ts'

export const WORKBUDDY_CHAT_API = 'workbuddy-api'
export const WORKBUDDY_MESSAGES_API = 'workbuddy-anthropic'

export interface WorkBuddyWireProfile {
  region: WorkBuddyRegion
  appVersion: string
  cliVersion: string
  appName: string
  runtime: string
  userAgent: string
  openAISdkVersion: string
  nodeVersion: string
}

const DEFAULT_APP_VERSION = '5.9.3'
const DEFAULT_CLI_VERSION = '2.165.0'
const OPENAI_SDK_VERSION = '6.25.0'
const DESKTOP_NODE_VERSION = 'v22.21.1'

function envValue(name: string, fallback: string): string {
  const value = process.env[name]?.trim()
  return value === undefined || value === '' ? fallback : value
}

const APP_VERSION = envValue('WORKBUDDY_APP_VERSION', DEFAULT_APP_VERSION)
const CLI_VERSION = envValue('WORKBUDDY_CLI_VERSION', DEFAULT_CLI_VERSION)

/** The current desktop wire profile for one WorkBuddy region. */
export function wireProfileFor(region: WorkBuddyRegion): WorkBuddyWireProfile {
  const appName = region === 'global' ? 'workbuddy-ai' : 'WorkBuddy'
  return {
    region,
    appVersion: APP_VERSION,
    cliVersion: CLI_VERSION,
    appName,
    runtime: 'local-agent',
    userAgent: `WorkBuddy/${APP_VERSION} ${appName}/${APP_VERSION} CLI/${CLI_VERSION}`,
    openAISdkVersion: OPENAI_SDK_VERSION,
    nodeVersion: DESKTOP_NODE_VERSION,
  }
}

/**
 * Claude models on the China gateway use Anthropic's Messages route. WorkBuddy
 * AI does not expose that route, so its models stay on Chat Completions.
 */
export function usesMessagesApi(region: WorkBuddyRegion, modelId: string): boolean {
  return region === 'cn' && /^claude-/iu.test(modelId)
}

export function apiForModel(region: WorkBuddyRegion, modelId: string): string {
  return usesMessagesApi(region, modelId) ? WORKBUDDY_MESSAGES_API : WORKBUDDY_CHAT_API
}

