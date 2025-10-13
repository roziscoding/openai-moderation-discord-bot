import { z } from 'zod'
import { defineAction } from '../action'
import { applyPlaceholders } from '../utils'

const replyActionArgumentsSchema = z.object({
  content: z.string().meta({
    title: 'Content',
    description: 'The content to reply with',
    placeholder: 'Olá {author}, sua mensagem foi flagada como {flaggedCategories}',
    availablePlaceholders: ['author', 'flaggedCategories', 'guild', 'channel', 'authorMention'],
  }),
})

export const replyAction = defineAction({
  name: 'reply',
  description: 'Reply to the message',
  arguments: replyActionArgumentsSchema,
  execute: async (context) => {
    const { message, args } = context
    const text = applyPlaceholders(context, args.content)
    await message.reply(text)
  },
})
