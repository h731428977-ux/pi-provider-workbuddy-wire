import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import type { ExtensionAPI, ProviderConfig } from '@earendil-works/pi-coding-agent'
import {
  getApiProvider,
  unregisterApiProviders,
} from '@earendil-works/pi-ai/compat'

import initialize, { thinkingLevelMapFor } from '../src/index.ts'
import { nativeImageInput } from '../src/catalog.ts'
import { WorkBuddyCredentialStore } from '../src/store.ts'
import {
  WORKBUDDY_CHAT_API,
  WORKBUDDY_MESSAGES_API,
} from '../src/wire-profile.ts'
import type { WorkBuddyUpstreamModel } from '../src/store.ts'

const originalStatus = WorkBuddyCredentialStore.prototype.status

afterEach(() => {
  WorkBuddyCredentialStore.prototype.status = originalStatus
  unregisterApiProviders('provider:workbuddy')
})

test('plugin start registers both regions and custom stream adapters without local credentials', async () => {
  WorkBuddyCredentialStore.prototype.status = async function () {
    return {
      region: this.getRegion(),
      signedIn: false,
      candidates: [],
    }
  }

  const providers: Array<{ name: string; config: ProviderConfig }> = []
  const commands = new Map<string, unknown>()
  const pi = {
    registerProvider(name: string, config: ProviderConfig) {
      providers.push({ name, config })
    },
    registerCommand(name: string, options: unknown) {
      commands.set(name, options)
    },
  } as unknown as ExtensionAPI

  await initialize(pi)

  assert.deepEqual(providers.map(provider => provider.name), ['workbuddy', 'workbuddy-global'])
  for (const provider of providers) {
    assert.equal(provider.config.api, WORKBUDDY_CHAT_API)
    assert.equal(typeof provider.config.streamSimple, 'function')
    assert.equal(typeof provider.config.oauth?.login, 'function')
    assert.equal(typeof provider.config.oauth?.refreshToken, 'function')
    assert.equal(provider.config.models?.length, 3)
    for (const model of provider.config.models ?? []) {
      assert.equal(model.api, WORKBUDDY_CHAT_API)
      assert.equal(typeof (model as { reasoning?: unknown }).reasoning, 'boolean')
    }
  }

  assert.equal(getApiProvider(WORKBUDDY_CHAT_API)?.api, WORKBUDDY_CHAT_API)
  assert.equal(getApiProvider(WORKBUDDY_MESSAGES_API)?.api, WORKBUDDY_MESSAGES_API)
  assert.deepEqual(
    [...commands.keys()],
    ['workbuddy.status', 'workbuddy.sign', 'workbuddy.refresh', 'workbuddy.logout'],
  )
})

test('measured model capability aliases are mapped for Pi', () => {
  const deepseekFlash: WorkBuddyUpstreamModel = {
    id: 'deepseek-v4.1-flash',
    name: 'Deepseek-V4.1-Flash',
    contextWindow: 1_000_000,
    maxTokens: 128_000,
    reasoning: {
      supportedEfforts: ['low', 'high', 'max'],
      defaultEffort: 'high',
      canDisableThinking: true,
    },
  }
  const deepseekFlashSg: WorkBuddyUpstreamModel = {
    ...deepseekFlash,
    id: 'deepseek-v4.1-flash-sg',
  }
  const refusedOff: WorkBuddyUpstreamModel = {
    ...deepseekFlash,
    id: 'deepseek-v4-pro',
  }
  const ordinaryOff: WorkBuddyUpstreamModel = {
    ...deepseekFlash,
    id: 'glm-5.3-flash',
  }

  assert.equal(thinkingLevelMapFor(deepseekFlash)?.['off'], 'none')
  assert.equal(thinkingLevelMapFor(deepseekFlashSg)?.['off'], 'none')
  assert.equal(thinkingLevelMapFor(refusedOff)?.['off'], null)
  assert.equal(thinkingLevelMapFor(ordinaryOff)?.['off'], 'off')
  assert.equal(nativeImageInput('kimi-k3'), true)
  assert.equal(nativeImageInput('kimi-k3-1'), true)
})
