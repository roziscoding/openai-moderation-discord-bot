import { AuditLogEvent } from 'discord.js'
import { and, eq } from 'drizzle-orm'
import { globalPlugin, globalPluginEventListener } from 'knub'
import { auth } from '../../../auth'
import db from '../../../database'
import { schema } from '../../../database/schema'
import { logger } from '../../../logger'

const onNewGuild = globalPluginEventListener({
  event: 'guildCreate',
  listener: async (meta) => {
    const executor = await meta.args.guild
      .fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 })
      .then(auditLogs => auditLogs.entries.first()?.executor)

    if (!executor) {
      logger.error({ guildId: meta.args.guild.id }, '❌ Could not find executor')
      await meta.args.guild.leave()
      return
    }

    const ownerId = executor.id

    const user = await db
      .select({ id: schema.user.id })
      .from(schema.account)
      .innerJoin(schema.user, eq(schema.account.userId, schema.user.id))
      .where(and(eq(schema.account.accountId, ownerId), eq(schema.account.providerId, 'discord')))
      .limit(1)

    if (!user) {
      const channel = meta.args.guild.channels.cache.find(channel => channel.isSendable())
      await channel?.send('To add the bot to your server, please login via the dashboard first.')
      await meta.args.guild.leave()
      return
    }

    const organization = await db
      .select()
      .from(schema.organization)
      .where(eq(schema.organization.slug, meta.args.guild.id))
      .limit(1)

    if (organization.length) {
      await db
        .update(schema.organization)
        .set({
          name: meta.args.guild.name,
          slug: meta.args.guild.id,
          logo: meta.args.guild.iconURL({ extension: 'png' }) ?? undefined,
        })
        .where(eq(schema.organization.id, organization[0].id))
      return
    }

    await auth.api.createOrganization({
      body: {
        name: meta.args.guild.name,
        slug: meta.args.guild.id,
        userId: user[0].id,
        logo: meta.args.guild.iconURL({ extension: 'png' }) ?? undefined,
        metadata: {
          config: {},
        },
      },
    })
  },
})

export const newGuildPlugin = globalPlugin({
  name: 'new-guild',
  configParser: () => ({}),
  events: [onNewGuild],
})
