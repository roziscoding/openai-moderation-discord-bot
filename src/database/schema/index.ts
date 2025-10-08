import * as auth from './auth.schema'
import { guilds } from './guild.schema'
import { strikes } from './strike.schema'

export const schema = {
  guilds,
  strikes,
  ...auth,
}
export type Schema = typeof schema

export default schema
export * from './auth.schema'
export * from './guild.schema'
export * from './relations.schema'
export * from './strike.schema'
