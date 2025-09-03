import { z } from "zod"

export const AppConfig = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
}).transform(env => ({
  discord: {
    token: env.DISCORD_BOT_TOKEN
  },
  openai: {
    apiKey: env.OPENAI_API_KEY
  }
}))

export type AppConfig = z.infer<typeof AppConfig>

export const appConfig = AppConfig.parse(process.env)