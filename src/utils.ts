import type z from "zod";
import type { ActionContext } from "./plugins/moderation/actions/action";

export const applyPlaceholders = <TArgs extends z.ZodType | z.ZodNever = z.ZodNever>(
  context: ActionContext<TArgs>,
  text: string,
  placeholders: Record<string, string> = {},
) => {
  const allPlaceholders = {
    author: context.message.author.displayName,
    guild: context.message.guild?.name ?? "Unknown Guild",
    channel: context.message.channel.name,
    authorMention: `<@${context.message.author.id}>`,
    ...placeholders,
  };

  return text.replace(/{(\w+)}/g, (_, key) => allPlaceholders[key as keyof typeof allPlaceholders] ?? `{${key}}`);
};
