import { relations } from "drizzle-orm";
import { guilds } from "./guild";
import { strikes } from "./strike";

export const guildRelations = relations(guilds, ({ many }) => ({
  strikes: many(strikes),
}));

export const strikeRelations = relations(strikes, ({ one }) => ({
  guild: one(guilds, {
    fields: [strikes.guildId],
    references: [guilds.id],
  }),
}));
