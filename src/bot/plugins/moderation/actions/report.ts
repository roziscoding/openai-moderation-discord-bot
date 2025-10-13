import z from 'zod'
import { defineAction } from '../action'
import { applyPlaceholders } from '../utils'

const reportActionArgumentsSchema = z.object({
  reportMessage: z.string().meta({
    title: 'Report Message',
    description: 'The message to send to the server admins',
    placeholder: '{adminMention}, mensagem de {author} flagada como {flaggedCategories}',
    availablePlaceholders: ['adminMention', 'author', 'flaggedCategories', 'guild', 'channel', 'authorMention'],
  }),
})

export const reportAction = defineAction({
  name: 'report',
  description: 'Report the message to server admins',
  arguments: reportActionArgumentsSchema,
  execute: async (context) => {
    const { message, args, config } = context
    const adminRole = message.guild?.roles.cache.get(config.adminRoleId)
    if (!adminRole) {
      return
    }

    await message.reply(
      applyPlaceholders(context, args.reportMessage, {
        adminMention: adminRole.toString(),
      }),
    )
  },
})
