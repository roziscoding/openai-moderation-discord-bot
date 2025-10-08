import { Hono } from 'hono'
import { repositories } from '../../../database/repositories'

export const getByOwnerRoute = new Hono()

getByOwnerRoute.get('/', async (c) => {
  const ownerId = c.req.query('ownerId')

  if (!ownerId) {
    return c.json({ error: 'OwnerId is required' }, 400)
  }

  const guilds = await repositories.guild.findByOwnerId(ownerId)

  if (!guilds) {
    return c.json({ error: 'Guilds not found' }, 404)
  }

  return c.json(guilds)
})
