import process from "node:process";
import { z } from "zod";

export const AppConfig = z
  .object({
    DISCORD_BOT_TOKEN: z.string().min(1),
    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  })
  .transform((env) => ({
    discord: {
      token: env.DISCORD_BOT_TOKEN,
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
    },
    database: {
      url: env.DATABASE_URL,
    },
  }));

export type AppConfig = z.infer<typeof AppConfig>;

export const appConfig = AppConfig.parse(process.env);
