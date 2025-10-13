import * as auth from './auth.schema'
import { strikes } from './strike.schema'

export const schema = {
  strikes,
  ...auth,
}
export type Schema = typeof schema

export default schema
export * from './auth.schema'
export * from './relations.schema'
export * from './strike.schema'
