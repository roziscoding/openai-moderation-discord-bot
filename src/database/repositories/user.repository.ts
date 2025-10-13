import type { Database } from '..'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { schema } from '../schema'

export class UserRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string) {
    return await this.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    })
  }

  async findByDiscordId(discordId: string) {
    return await this.db
      .select(getTableColumns(schema.user))
      .from(schema.account)
      .innerJoin(schema.user, eq(schema.account.userId, schema.user.id))
      .where(
        and(
          eq(schema.account.accountId, discordId),
          eq(schema.account.providerId, 'discord'),
        ),
      )
  }
}
