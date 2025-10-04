import { z } from "zod";
import { applyPlaceholders } from "../../../utils";
import { defineAction } from "./action";

const strikeActionArgumentsSchema = z.object({
  maxStrikes: z.number(),
  strikeMessage: z.string(),
  maxStrikesMessage: z.string(),
  onMaxStrikes: z.enum(["delete", "ban"]),
});

const strikesMap = new Map<string, number>();

export const strikeAction = defineAction({
  name: "strike",
  description: "Add a strike to the user. If the user reaches the max strikes, the user will be banned or deleted.",
  arguments: strikeActionArgumentsSchema,
  execute: async (context) => {
    const { message, args } = context;
    const strikes = (strikesMap.get(message.author.id) ?? 0) + 1;
    strikesMap.set(message.author.id, strikes);

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

    await message.reply(text);

    if (strikes < args.maxStrikes) return;

    strikesMap.set(message.author.id, 0);

    args.onMaxStrikes === "delete" && (await message.delete());
    args.onMaxStrikes === "ban" && (await message.guild?.members.ban(message.author.id));
  },
});
