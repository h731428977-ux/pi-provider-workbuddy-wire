/**
 * Clearing stored credentials (plugin-owned copies and OAuth vault files).
 * The desktop app's auth file is NEVER touched.
 */

import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { pluginDataDir } from './auth.ts'
import type { WorkBuddyRegion } from './upstream.ts'

export function clearStoredCredentials(region: WorkBuddyRegion): void {
  const dir = pluginDataDir()
  for (const path of [
    join(dir, `auth.${region}.json`),
    join(dir, 'workbuddy-vault', region),
  ]) {
    try {
      if (existsSync(path)) rmSync(path, { recursive: true, force: true })
    } catch {
      // Best effort; the next refresh overwrites anyway.
    }
  }
}
