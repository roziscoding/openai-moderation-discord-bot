import { z } from 'zod'
import { deleteMessageAction } from './delete-message'
import { replyAction } from './reply'
import { reportAction } from './report'
import { strikeAction } from './strike'

export const ACTIONS = {
  delete: deleteMessageAction,
  reply: replyAction,
  strike: strikeAction,
  report: reportAction,
} as const

export const ModerationAction = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('delete'),
  }),
  z.object({
    action: z.literal('reply'),
    arguments: replyAction.arguments,
  }),
  z.object({
    action: z.literal('report'),
    arguments: reportAction.arguments,
  }),
  z.object({
    action: z.literal('strike'),
    arguments: strikeAction.arguments,
  }),
])

export type ModerationAction = z.input<typeof ModerationAction>
