import type { AppEnv } from '../../../types'
import { Hono } from 'hono'
import { auth } from '../../../auth'

export const list = new Hono<AppEnv>()

list.get('/', async (c) => {
  const organizations = await auth.api.listOrganizations({ headers: c.req.raw.headers })

  if (!organizations) {
    return c.json({ error: 'Guilds not found' }, 404)
  }

  return c.json(organizations)
})
