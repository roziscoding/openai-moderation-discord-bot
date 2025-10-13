import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { organization } from './auth.schema'

export const strikes = pgTable('strikes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  guildId: text('guild_id')
    .notNull()
    .references(() => organization.slug),
  strike: integer('strike').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  deletedAt: timestamp('deleted_at'),
})
