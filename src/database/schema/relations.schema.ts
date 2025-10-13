import { relations } from 'drizzle-orm'
import { organization } from './auth.schema'
import { strikes } from './strike.schema'

export const guildRelations = relations(organization, ({ many }) => ({
  strikes: many(strikes),
}))

export const strikeRelations = relations(strikes, ({ one }) => ({
  guild: one(organization, {
    fields: [strikes.guildId],
    references: [organization.slug],
  }),
}))
