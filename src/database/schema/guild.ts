import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", {
  id: text("id").notNull().primaryKey(),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
