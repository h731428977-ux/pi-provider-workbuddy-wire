import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { gunzipSync } from 'node:zlib'
import {
  normalizeContext,
  type AssistantMessageEvent,
  type Model,
} from '@earendil-works/pi-ai'

import type { WorkBuddyCredential } from '../src/auth.ts'
import { createWorkBuddyStream } from '../src/stream.ts'
import { deriveWireIdentity } from '../src/wire-identity.ts'
import { WORKBUDDY_CHAT_API, WORKBUDDY_MESSAGES_API } from '../src/wire-profile.ts'

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

function model(api: string, id: string): Model<string> {
  return {
    id,
    name: id,
    api,
    provider: 'workbuddy',
    baseUrl: 'https://copilot.tencent.com',
    input: ['text'],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    reasoning: false,
    contextWindow: 32_000,
    maxTokens: 8_000,
  }
}

async function collect(
  events: AsyncIterable<AssistantMessageEvent>,
): Promise<AssistantMessageEvent[]> {
  const collected: AssistantMessageEvent[] = []
  for await (const event of events) collected.push(event)
  return collected
}

test('Chat stream runs through Pi adapter with WorkBuddy wire identity', async () => {
  let capturedUrl = ''
  let capturedInit: RequestInit | undefined
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input)
    capturedInit = init
    const sse = [
      'data: {"id":"chatcmpl-fixture","object":"chat.completion.chunk","created":1,"model":"glm-5.3","choices":[{"index":0,"delta":{"role":"assistant","content":"hello from WorkBuddy"},"finish_reason":null}]}',
      'data: {"id":"chatcmpl-fixture","object":"chat.completion.chunk","created":1,"model":"glm-5.3","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}',
      'data: [DONE]',
      '',
    ].join('\n\n')
    return new Response(sse, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    })
  }

  const chat = createWorkBuddyStream(async () => credential)
  const context = normalizeContext({
    systemPrompt: 'Be concise.',
    messages: [{ role: 'user', content: 'hello', timestamp: 1000 }],
  })
  const events = await collect(chat(model(WORKBUDDY_CHAT_API, 'glm-5.3'), context, {
    sessionId: 'session-1',
  }))

  const expectedIdentity = deriveWireIdentity(credential, context.messages, 'session-1')
  assert.equal(capturedUrl, 'https://copilot.tencent.com/v2/chat/completions')
  const headers = new Headers(capturedInit?.headers)
  assert.equal(headers.get('content-encoding'), 'gzip')
  assert.equal(headers.get('authorization'), 'Bearer access-token')
  assert.equal(headers.get('user-agent'), 'WorkBuddy/5.9.3 WorkBuddy/5.9.3 CLI/2.165.0')
  assert.equal(headers.get('x-conversation-id'), expectedIdentity.conversationId)
  assert.equal(headers.get('x-conversation-request-id'), expectedIdentity.turnId)
  assert.match(headers.get('x-conversation-message-id') ?? '', /^[0-9a-f]{32}$/u)
  assert.equal(headers.get('x-request-id'), headers.get('x-conversation-message-id'))

  const body = JSON.parse(
    gunzipSync(Buffer.from(capturedInit?.body as Uint8Array)).toString('utf8'),
  ) as Record<string, unknown>
  assert.equal(body['model'], 'glm-5.3')
  assert.equal(body['stream'], true)
  assert.deepEqual(
    (body['messages'] as Array<Record<string, unknown>>).map(message => message['role']),
    ['system', 'user'],
  )

  assert.equal(events[0]?.type, 'start')
  assert.ok(events.some(event => event.type === 'text_delta' && event.delta === 'hello from WorkBuddy'))
  assert.ok(events.some(event => event.type === 'done' && event.reason === 'stop'))
})

test('Claude stream runs through Pi Anthropic adapter without gzip', async () => {
  let capturedUrl = ''
  let capturedInit: RequestInit | undefined
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input)
    capturedInit = init
    const sse = [
      'event: message_start',
      'data: {"type":"message_start","message":{"id":"msg_fixture","type":"message","role":"assistant","content":[],"model":"claude-opus-5.5","stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":1,"output_tokens":0}}}',
      '',
      'event: content_block_start',
      'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
      '',
      'event: content_block_delta',
      'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"hello from Claude"}}',
      '',
      'event: content_block_stop',
      'data: {"type":"content_block_stop","index":0}',
      '',
      'event: message_delta',
      'data: {"type":"message_delta","delta":{"stop_reason":"end_turn","stop_sequence":null},"usage":{"output_tokens":1}}',
      '',
      'event: message_stop',
      'data: {"type":"message_stop"}',
      '',
      '',
    ].join('\n')
    return new Response(sse, {
      status: 200,
      headers: { 'content-type': 'text/event-stream' },
    })
  }

  const chat = createWorkBuddyStream(async () => credential)
  const context = normalizeContext({
    messages: [{ role: 'user', content: 'hello', timestamp: 1000 }],
  })
  const events = await collect(chat(model(WORKBUDDY_MESSAGES_API, 'claude-opus-5.5'), context, {
    sessionId: 'session-1',
  }))

  assert.equal(capturedUrl, 'https://copilot.tencent.com/v1/messages')
  const headers = new Headers(capturedInit?.headers)
  assert.equal(headers.get('content-encoding'), null)
  assert.equal(headers.get('anthropic-version'), '2023-06-01')
  assert.equal(typeof capturedInit?.body, 'string')
  const body = JSON.parse(capturedInit?.body as string) as Record<string, unknown>
  assert.equal(body['model'], 'claude-opus-5.5')
  assert.equal(body['stream'], true)
  assert.deepEqual(
    (body['messages'] as Array<Record<string, unknown>>).map(message => message['role']),
    ['user'],
  )

  assert.equal(events[0]?.type, 'start')
  assert.ok(events.some(event => event.type === 'text_delta' && event.delta === 'hello from Claude'))
  assert.ok(events.some(event => event.type === 'done' && event.reason === 'stop'))
})
