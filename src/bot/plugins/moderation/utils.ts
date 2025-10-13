import type z from 'zod'
import type { Action, ActionContext, ActionFunction } from './action'
import type { ModerationAction } from './actions'
import { logger } from '../../../logger'

export async function runActions(actions: ModerationAction[], context: Omit<ActionContext<unknown>, 'args'>, ACTIONS: Record<string, Action<z.ZodType | undefined>>) {
  for (const action of actions) {
    logger.debug({ ...action }, '▶️ Running action')
    const actionDefinition = ACTIONS[action.action as keyof typeof ACTIONS]

    if (!actionDefinition) {
      continue
    }

    // biome-ignore lint/suspicious/noExplicitAny: action is a discriminated union. to type it correctly, I'd need to break DRY
    const validatedArgs = actionDefinition.arguments?.parse((action as any).arguments)
    const actionFn = actionDefinition.execute as ActionFunction<(typeof actionDefinition)['arguments']>
    await actionFn({ ...context, args: validatedArgs })
  }
}

export function applyPlaceholders<TArgs extends z.ZodType | z.ZodNever = z.ZodNever>(context: ActionContext<TArgs>, text: string, placeholders: Record<string, string> = {}) {
  const allPlaceholders = {
    author: context.message.author.displayName,
    guild: context.message.guild?.name ?? 'Unknown Guild',
    channel: context.message.channel.name,
    authorMention: `<@${context.message.author.id}>`,
    flaggedCategories: context.flaggedCategories.join(', '),
    ...placeholders,
  }

  return text.replace(/\{(\w+)\}/g, (_, key) => allPlaceholders[key as keyof typeof allPlaceholders] ?? `{${key}}`)
}
