import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { gunzipSync } from 'node:zlib'
import type { Message } from '@earendil-works/pi-ai/compat'

import { WorkBuddyUpstreamClient, prepareChatBody } from '../src/client.ts'
import type { WorkBuddyCredential } from '../src/auth.ts'
import { deriveWireIdentity } from '../src/wire-identity.ts'
import { apiForModel, WORKBUDDY_CHAT_API, WORKBUDDY_MESSAGES_API } from '../src/wire-profile.ts'
import { workBuddyModelHeaders } from '../src/wire.ts'

const realFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = realFetch
})

const credential: WorkBuddyCredential = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresAtMs: Date.now() + 3_600_000,
  domain: 'copilot.tencent.com',
  uid: 'user-1',
  enterpriseId: 'enterprise-1',
  source: 'oauth',
}

const user = (text: string, timestamp: number): Message => ({
  role: 'user',
  content: text,
  timestamp,
} as Message)

const assistant = (timestamp: number): Message => ({
  role: 'assistant',
  content: [],
  timestamp,
} as unknown as Message)

const toolResult = (timestamp: number): Message => ({
  role: 'toolResult',
  toolCallId: 'call-1',
  toolName: 'read',
  content: [{ type: 'text', text: 'ok' }],
  isError: false,
  timestamp,
} as unknown as Message)

const HEX32 = /^[0-9a-f]{32}$/u

test('conversation identity is stable per Pi session and turn', () => {
  const first = deriveWireIdentity(credential, [user('fix it', 1000)], 'session-1')
  const toolStep = deriveWireIdentity(
    credential,
    [user('fix it', 1000), assistant(1001), toolResult(1002)],
    'session-1',
  )
  const nextTurn = deriveWireIdentity(
    credential,
    [user('fix it', 1000), assistant(1001), user('and test it', 1003)],
    'session-1',
  )

  assert.equal(first.conversationId, toolStep.conversationId)
  assert.equal(first.conversationId, nextTurn.conversationId)
  assert.equal(first.turnId, toolStep.turnId)
  assert.notEqual(first.turnId, nextTurn.turnId)
  assert.notEqual(first.messageId, toolStep.messageId)
  assert.equal(first.messageId, first.requestId)
  assert.match(first.conversationId, HEX32)
  assert.match(first.turnId, HEX32)
})

test('conversation identity is account-scoped', () => {
  const one = deriveWireIdentity(credential, [user('hello', 1000)], 'session-1')
  const two = deriveWireIdentity({ ...credential, uid: 'user-2' }, [user('hello', 1000)], 'session-1')

  assert.notEqual(one.conversationId, two.conversationId)
  assert.notEqual(one.turnId, two.turnId)
})

test('model headers carry WorkBuddy desktop identity and stable ids', () => {
  const identity = deriveWireIdentity(credential, [user('hello', 1000)], 'session-1')
  const headers = workBuddyModelHeaders(credential, identity)

  assert.equal(headers['User-Agent'], 'WorkBuddy/5.9.3 WorkBuddy/5.9.3 CLI/2.165.0')
  assert.equal(headers['X-Requested-With'], 'XMLHttpRequest')
  assert.equal(headers['X-Product'], 'SaaS')
  assert.equal(headers['X-IDE-Type'], 'WorkBuddy')
  assert.equal(headers['X-IDE-Name'], 'WorkBuddy')
  assert.equal(headers['X-IDE-Version'], '5.9.3')
  assert.equal(headers['X-Agent-Intent'], 'craft')
  assert.equal(headers['X-Agent-Purpose'], 'conversation')
  assert.equal(headers['X-Agent-Type'], 'main')
  assert.equal(headers['X-Agent-Runtime'], 'local-agent')
  assert.equal(headers['X-Conversation-ID'], identity.conversationId)
  assert.equal(headers['X-Conversation-Request-ID'], identity.turnId)
  assert.equal(headers['X-Conversation-Message-ID'], identity.messageId)
  assert.equal(headers['X-Request-ID'], identity.requestId)
  assert.equal(headers['X-Enterprise-Id'], 'enterprise-1')
  assert.equal(headers['X-Tenant-Id'], 'enterprise-1')
})

test('Claude is native Messages only on the China gateway', () => {
  assert.equal(apiForModel('cn', 'claude-opus-5.5'), WORKBUDDY_MESSAGES_API)
  assert.equal(apiForModel('cn', 'glm-5.3'), WORKBUDDY_CHAT_API)
  assert.equal(apiForModel('global', 'claude-opus-5.5'), WORKBUDDY_CHAT_API)
})

test('chat requests use the chat endpoint and gzip', async () => {
  let capturedUrl = ''
  let capturedInit: RequestInit | undefined
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input)
    capturedInit = init
    return new Response('data: [DONE]\n\n', {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    })
  }

  const identity = deriveWireIdentity(credential, [user('hello', 1000)], 'session-1')
  const body = '{"model":"glm-5.3","stream":true,"messages":[{"role":"user","content":"hello"}]}'
  const result = await new WorkBuddyUpstreamClient().chatStream(credential, body, identity)

  assert.equal(result.ok, true)
  assert.equal(capturedUrl, 'https://copilot.tencent.com/v2/chat/completions')
  const headers = new Headers(capturedInit?.headers)
  assert.equal(headers.get('content-encoding'), 'gzip')
  assert.equal(headers.get('x-ide-type'), 'WorkBuddy')
  assert.equal(headers.get('x-conversation-id'), identity.conversationId)
  const bodyBytes = capturedInit?.body as Uint8Array
  assert.equal(gunzipSync(Buffer.from(bodyBytes)).toString('utf8'), body)
})

test('Claude Messages requests stay uncompressed and keep Anthropic headers', async () => {
  let capturedUrl = ''
  let capturedInit: RequestInit | undefined
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input)
    capturedInit = init
    return new Response('event: message_stop\ndata: {}\n\n', {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    })
  }

  const identity = deriveWireIdentity(credential, [user('hello', 1000)], 'session-1')
  const body = '{"model":"claude-opus-5.5","max_tokens":100,"stream":true,"messages":[{"role":"user","content":"hello"}]}'
  const result = await new WorkBuddyUpstreamClient().messagesStream(
    credential,
    body,
    identity,
    undefined,
    {
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'interleaved-thinking-2025-05-14',
      'x-api-key': 'must-not-pass-through',
    },
  )

  assert.equal(result.ok, true)
  assert.equal(capturedUrl, 'https://copilot.tencent.com/v1/messages')
  const headers = new Headers(capturedInit?.headers)
  assert.equal(headers.get('content-encoding'), null)
  assert.equal(headers.get('anthropic-version'), '2023-06-01')
  assert.equal(headers.get('anthropic-beta'), 'interleaved-thinking-2025-05-14')
  assert.equal(headers.get('x-api-key'), null)
  assert.equal(capturedInit?.body, body)
})

test('chat body normalization still enforces WorkBuddy fields', () => {
  const normalized = JSON.parse(prepareChatBody(JSON.stringify({
    model: 'glm-5.3',
    stream: false,
    messages: [{ role: 'developer', content: 'be useful' }, { role: 'user', content: 'hello' }],
    tool_choice: { type: 'function', function: { name: 'read' } },
  }))) as Record<string, unknown>

  assert.equal(normalized['stream'], true)
  assert.equal((normalized['messages'] as Array<Record<string, unknown>>)[0]?.['role'], 'system')
  assert.equal(normalized['tool_choice'], 'read')
})

