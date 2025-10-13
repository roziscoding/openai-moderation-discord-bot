import { Hono } from 'hono'
import { requireAuth } from '../../middleware/require-auth.middleware'
import { list } from './list.route'

export const organizationRoutes = new Hono()

organizationRoutes.use(requireAuth)

organizationRoutes.route('/', list)
