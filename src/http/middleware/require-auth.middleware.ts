import type { AppEnv } from '../../types'
import { createMiddleware } from 'hono/factory'

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get('user')
  const session = c.get('session')

  if (!user || !session) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return next()
})
