import { eq } from "drizzle-orm";
import type { Database } from "..";
import { guilds } from "../schema";

export class GuildRepository {
  constructor(private readonly db: Database) {}

  async getOrInitializeConfig(id: string) {
    const guild = await this.db.query.guilds.findFirst({
      where: eq(guilds.id, id),
    });

    if (guild) {
      return guild.config;
    }

    await this.db.insert(guilds).values({
      id,
      config: {},
    });

    return {};
  }

  async setConfig(id: string, config: Record<string, unknown>) {
    await this.db.update(guilds).set({ config }).where(eq(guilds.id, id));
  }
}
