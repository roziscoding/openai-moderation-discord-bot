import { Hono } from 'hono'
import { getByOwnerRoute } from './get-by-owner.route'

export const guildsRoute = new Hono()

guildsRoute.route('/', getByOwnerRoute)
