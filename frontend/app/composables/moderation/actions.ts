import type z from 'zod'
import { ACTIONS } from '../../../../src/bot/plugins/moderation/actions'

function isAction(action: string): action is keyof typeof ACTIONS {
  return Object.keys(ACTIONS).includes(action)
}

export function useActions() {
  function getAction(action: string) {
    if (!isAction(action)) {
      return {
        name: action,
        description: 'Unknown action. Check server configuration.',
      }
    }

    return ACTIONS[action] as unknown as {
      name: string
      description: string
      arguments?: z.ZodType
    }
  }

  return {
    getAction,
    ACTIONS,
  }
}
