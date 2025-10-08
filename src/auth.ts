import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin, organization } from 'better-auth/plugins'
import { appConfig } from './config'
import db from './database'

const { discord } = appConfig

export const auth = betterAuth({
  basePath: '/auth',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    discord: {
      clientId: discord.clientId,
      clientSecret: discord.clientSecret,
    },
  },
  plugins: [organization(), admin()],
  trustedOrigins: ['http://localhost:3001'],
})
