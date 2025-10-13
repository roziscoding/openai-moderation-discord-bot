import type { Server } from 'bun'
import type { AppEnv } from '../types'
import { Hono } from 'hono'
import { format } from 'ms'
import { logger } from '../logger'
import { injectAuth } from './middleware/inject-auth.middleware'
import { authRoute } from './routes/auth'
import { healthcheckRoute } from './routes/healthcheck'
import { organizationRoutes } from './routes/organizations'

const PORT = Number(Bun.env.PORT ?? '3000')

const app = new Hono<AppEnv>()

app.use(injectAuth)

app.use(async (c, next) => {
  const start = performance.now()

  await next()

  const duration = performance.now() - start
  logger.info(`[${c.req.method}] ${c.req.path} - ${format(Math.round(duration))}`)
})

app.route('/healthcheck', healthcheckRoute)
app.route('/auth', authRoute)
app.route('/organizations', organizationRoutes)

let server: Server | null = null

export default {
  start: async () => {
    server = Bun.serve({
      port: PORT,
      fetch: app.fetch,
    })
  },
  stop: async () => {
    server?.stop()
  },
}

logger.info(`🚀 Server is running on port ${PORT}`)
