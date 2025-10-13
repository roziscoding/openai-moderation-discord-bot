import type { StringValue } from 'ms'
import { ms } from 'ms'
import { z } from 'zod'
import { logger } from '../../../../logger'
import { defineAction } from '../action'
import { applyPlaceholders, runActions } from '../utils'
import { deleteMessageAction } from './delete-message'
import { replyAction } from './reply'
import { reportAction } from './report'

export const OnMaxStrikesAction = z.discriminatedUnion('action', [
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
])

const strikeActionArgumentsSchema = z.object({
  maxStrikes: z.number().meta({
    title: 'Max Strikes',
    description: 'The maximum number of strikes before action is taken',
    placeholder: 3,
  }),
  strikeMessage: z.string().meta({
    title: 'Strike Message',
    description: 'The message to send to the user when they are struck',
    placeholder: '{currentStrike} out of {maxStrikes}',
    availablePlaceholders: ['currentStrike', 'maxStrikes', 'author', 'guild', 'channel', 'authorMention', 'flaggedCategories'],
  }),
  maxStrikesMessage: z.string().meta({
    title: 'Max Strikes Message',
    description: 'The message to send to the user when they reach the maximum number of strikes',
    placeholder: 'Your message has been flagged as {flaggedCategories}',
    availablePlaceholders: ['flaggedCategories', 'author', 'guild', 'channel', 'authorMention'],
  }),
  onMaxStrikes: z.array(OnMaxStrikesAction).meta({
    title: 'On Max Strikes',
    description: 'The actions to take when the user reaches the maximum number of strikes',
    placeholder: '{reply}, {report}, {delete}',
  }),
  perReason: z.boolean().optional().default(false).meta({
    title: 'Per Reason',
    description: 'Whether to count strikes per reason or not',
  }),
  ttl: z.string().meta({
    title: 'Strike Duration',
    description: 'The time to live for the strike',
    placeholder: '30d',
  }),
})

export const strikeAction = defineAction({
  name: 'strike',
  description: 'Add a strike to the user. If the user reaches the max strikes, the user will be banned or deleted.',
  arguments: strikeActionArgumentsSchema,
  execute: async (context) => {
    const { message, args, repositories } = context

    if (!message.guildId) {
      logger.error({ message }, '❌ Message has no guildId')
      return
    }

    const strikes = await repositories.strikes
      .countForUser({
        userId: message.author.id,
        guildId: message.guildId,
        reasons: context.args.perReason ? context.flaggedCategories : undefined,
      })
      .then(count => count + 1)

    const placeholders = {
      currentStrike: strikes.toString(),
      maxStrikes: args.maxStrikes.toString(),
    }

    const text = applyPlaceholders(
      context,
      strikes < args.maxStrikes ? args.strikeMessage : args.maxStrikesMessage,
      placeholders,
    )

    await repositories.strikes.strikeUser({
      userId: message.author.id,
      guildId: message.guildId,
      reason: context.flaggedCategories.join(', '),
      ttlInMs: ms(args.ttl as StringValue),
      strike: strikes,
    })

    await message.reply(text)

    if (strikes < args.maxStrikes)
      return

    await runActions(args.onMaxStrikes, context, {
      reply: replyAction,
      report: reportAction,
      delete: deleteMessageAction,
    })

    await repositories.strikes.clearUserStrikes({
      userId: message.author.id,
      guildId: message.guildId,
    })
  },
})
