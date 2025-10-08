import { eq } from "drizzle-orm";
import type { Database } from "..";
import { guilds } from "../schema";

export class GuildRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string) {
    const guild = await this.db.query.guilds.findFirst({
      where: eq(guilds.id, id),
    });

    return guild;
  }

  async setConfig(id: string, config: Record<string, unknown>) {
    await this.db.update(guilds).set({ config }).where(eq(guilds.id, id));
  }

  async create(id: string, name: string) {
    await this.db.insert(guilds).values({ id, name, config: {} });
  }
}
