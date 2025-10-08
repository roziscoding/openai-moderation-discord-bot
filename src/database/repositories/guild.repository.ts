import type { Database } from '..'
import { eq } from 'drizzle-orm'
import { guilds } from '../schema'

export class GuildRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string) {
    const guild = await this.db.query.guilds.findFirst({
      where: eq(guilds.id, id),
    })

    return guild
  }

  async setConfig(id: string, config: Record<string, unknown>) {
    await this.db.update(guilds).set({ config }).where(eq(guilds.id, id))
  }

  async create(id: string, name: string, ownerId: string) {
    await this.db
      .insert(guilds)
      .values({ id, name, config: {}, ownerId })
      .onConflictDoUpdate({
        target: [guilds.id],
        set: {
          name,
          updatedAt: new Date(),
        },
      })
  }

  async findByOwnerId(ownerId: string) {
    const guilds = await this.db.query.guilds.findMany({
      where: (guilds, { eq }) => eq(guilds.ownerId, ownerId),
    })

    return guilds
  }
}
