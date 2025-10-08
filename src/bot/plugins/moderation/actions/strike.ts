import { ms, type StringValue } from "ms";
import { z } from "zod";
import { logger } from "../../../../logger";
import { defineAction } from "../action";
import { applyPlaceholders, runActions } from "../utils";
import { deleteMessageAction } from "./delete-message";
import { replyAction } from "./reply";
import { reportAction } from "./report";

export const OnMaxStrikesAction = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("delete"),
  }),
  z.object({
    action: z.literal("reply"),
    arguments: replyAction.arguments,
  }),

  z.object({
    action: z.literal("report"),
    arguments: reportAction.arguments,
  }),
]);

const strikeActionArgumentsSchema = z.object({
  maxStrikes: z.number(),
  strikeMessage: z.string(),
  maxStrikesMessage: z.string(),
  onMaxStrikes: z.array(OnMaxStrikesAction),
  perReason: z.boolean().optional().default(false),
  ttl: z.string().transform((val) => val as StringValue),
});

export const strikeAction = defineAction({
  name: "strike",
  description: "Add a strike to the user. If the user reaches the max strikes, the user will be banned or deleted.",
  arguments: strikeActionArgumentsSchema,
  execute: async (context) => {
    const { message, args, repositories } = context;

    if (!message.guildId) {
      logger.error({ message }, "❌ Message has no guildId");
      return;
    }

    const strikes = await repositories.strikes
      .countForUser({
        userId: message.author.id,
        guildId: message.guildId,
        reasons: context.args.perReason ? context.flaggedCategories : undefined,
      })
      .then((count) => count + 1);

    const placeholders = {
      strike: strikes.toString(),
      currentStrike: strikes.toString(),
      maxStrikes: args.maxStrikes.toString(),
    };

    const text = applyPlaceholders(
      context,
      strikes < args.maxStrikes ? args.strikeMessage : args.maxStrikesMessage,
      placeholders,
    );

    await repositories.strikes.strikeUser({
      userId: message.author.id,
      guildId: message.guildId,
      reason: context.flaggedCategories.join(", "),
      ttlInMs: ms(args.ttl),
      strike: strikes,
    });

    await message.reply(text);

    if (strikes < args.maxStrikes) return;

    await runActions(args.onMaxStrikes, context, {
      reply: replyAction,
      report: reportAction,
      delete: deleteMessageAction,
    });

    await repositories.strikes.clearUserStrikes({
      userId: message.author.id,
      guildId: message.guildId,
    });
  },
});
