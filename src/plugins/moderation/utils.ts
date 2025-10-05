import type z from "zod";
import { logger } from "../../logger";
import type { Action, ActionContext, ActionFunction } from "./action";
import type { ModerationAction } from "./actions";

export const runActions = async (
  actions: ModerationAction[],
  context: Omit<ActionContext<unknown>, "args">,
  ACTIONS: Record<string, Action<z.ZodType | undefined>>,
) => {
  for (const action of actions) {
    logger.debug({ ...action }, "▶️ Running action");
    const actionDefinition = ACTIONS[action.action as keyof typeof ACTIONS];

    if (!actionDefinition) {
      continue;
    }

    // biome-ignore lint/suspicious/noExplicitAny: action is a discriminated union. to type it correctly, I'd need to break DRY
    const validatedArgs = actionDefinition.arguments?.parse((action as any).arguments);
    const actionFn = actionDefinition.execute as ActionFunction<(typeof actionDefinition)["arguments"]>;
    await actionFn({ ...context, args: validatedArgs });
  }
};
