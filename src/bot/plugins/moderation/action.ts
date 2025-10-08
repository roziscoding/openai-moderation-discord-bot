import type { GuildMessage } from 'knub/dist/types'
import type { z } from 'zod'
import type { repositories } from '../../../database/repositories'
import type { PluginConfig } from './types'

export interface ActionContext<TArgSchema> {
  message: GuildMessage
  args: z.output<TArgSchema>
  flaggedCategories: string[]
  repositories: typeof repositories
  config: PluginConfig
}

export type ActionFunction<TArgSchema> = (context: ActionContext<TArgSchema>) => Promise<void>

export interface Action<TArgSchema> {
  name: string
  description: string
  arguments: TArgSchema
  execute: ActionFunction<TArgSchema>
}

export function defineAction<TArgSchema = undefined>(values: {
  name: string
  description: string
  execute: ActionFunction<TArgSchema>
  arguments?: TArgSchema
}): Action<TArgSchema> {
  return {
    name: values.name,
    description: values.description,
    arguments: values.arguments ?? (undefined as TArgSchema),
    execute: values.execute,
  }
}
