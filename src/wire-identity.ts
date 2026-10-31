/**
 * WorkBuddy request identity.
 *
 * WorkBuddy counts one user send as one request even when an agent makes
 * several HTTP calls for tool results or retries. A conversation therefore
 * has a stable id, each user turn has a stable request id, and every individual
 * HTTP request gets its own message/request id.
 */

import { createHash, randomBytes } from 'node:crypto'
import type { Message } from '@earendil-works/pi-ai/compat'
import type { WorkBuddyCredential } from './store.ts'

export interface WorkBuddyWireIdentity {
  conversationId: string
  turnId: string
  messageId: string
  requestId: string
}

type AccountIdentity = Pick<WorkBuddyCredential, 'uid' | 'enterpriseId' | 'domain'>

// A process-local salt keeps the ids opaque while preserving them for the life
// of one Pi process, matching the desktop client's run-scoped identity.
const SALT = randomBytes(16).toString('hex')

function randomId(): string {
  return randomBytes(16).toString('hex')
}

function stableId(kind: string, account: AccountIdentity, ...parts: string[]): string {
  const hash = createHash('sha256')
  hash.update(`${SALT}|${kind}|`)
  hash.update(account.uid)
  hash.update('|')
  hash.update(account.enterpriseId ?? '')
  hash.update('|')
  hash.update(account.domain)
  for (const part of parts) {
    hash.update('|')
    hash.update(part)
  }
  return hash.digest('hex').slice(0, 32)
}

function userMessageKey(message: Extract<Message, { role: 'user' }>): string {
  const content = message.content
  if (typeof content === 'string') return content

  const hash = createHash('sha256')
  let meaningful = false
  for (const part of content) {
    if (part.type === 'text') {
      meaningful ||= part.text.trim() !== ''
      hash.update('text\0')
      hash.update(part.text)
      hash.update('\0')
      continue
    }
    meaningful = true
    hash.update('image\0')
    hash.update(part.mimeType)
    hash.update('\0')
    hash.update(part.data)
    hash.update('\0')
  }
  return meaningful ? `parts:${hash.digest('hex')}` : ''
}

function userTurnKey(message: Extract<Message, { role: 'user' }>): string {
  const content = userMessageKey(message)
  return content === '' ? '' : `${message.timestamp}:${content}`
}

/**
 * Derive the identity WorkBuddy sees for the current Pi request.
 *
 * `sessionId` is supplied by Pi to the provider. The last real user message
 * remains unchanged while tool results are appended, so it is the stable key
 * for one user turn.
 */
export function deriveWireIdentity(
  credential: AccountIdentity,
  messages: readonly Message[],
  sessionId?: string,
): WorkBuddyWireIdentity {
  const users = messages.filter(
    (message): message is Extract<Message, { role: 'user' }> => message.role === 'user' && userMessageKey(message) !== '',
  )
  const firstUser = users[0]
  const lastUser = users.at(-1)

  const conversationKey = sessionId !== undefined && sessionId.trim() !== ''
    ? `session:${sessionId}`
    : firstUser === undefined
      ? `anonymous:${randomId()}`
      : `first-user:${userTurnKey(firstUser)}`

  const conversationId = stableId('conversation', credential, conversationKey)
  const turnId = lastUser === undefined
    ? randomId()
    : stableId('turn', credential, conversationId, userTurnKey(lastUser))
  const messageId = randomId()

  return {
    conversationId,
    turnId,
    messageId,
    requestId: messageId,
  }
}

