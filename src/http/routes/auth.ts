import type { AppEnv } from '../../types'
import { Hono } from 'hono'
import { auth } from '../../auth'

export const authRoute = new Hono<AppEnv>()

authRoute.on(['GET', 'POST'], '/*', c => auth.handler(c.req.raw))
