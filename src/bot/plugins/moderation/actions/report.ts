import z from 'zod'
import { defineAction } from '../action'
import { applyPlaceholders } from '../utils'

const reportActionArgumentsSchema = z.object({
  reportMessage: z.string(),
})

export const reportAction = defineAction({
  name: 'report',
  description: 'Report the message to server admins',
  arguments: reportActionArgumentsSchema,
  execute: async (context) => {
    const { message, args, flaggedCategories, config } = context
    const adminRole = message.guild?.roles.cache.get(config.adminRoleId)
    if (!adminRole) {
      return
    }

    await message.reply(
      applyPlaceholders(context, args.reportMessage, {
        flaggedCategories: flaggedCategories.join(', '),
        adminMention: adminRole.toString(),
      }),
    )
  },
})
