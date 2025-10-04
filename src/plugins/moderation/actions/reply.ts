import { z } from "zod";
import { applyPlaceholders } from "../../../utils";
import { defineAction } from "./action";

const replyActionArgumentsSchema = z.object({
  content: z.string(),
});

export const replyAction = defineAction({
  name: "reply",
  description: "Reply to the message",
  arguments: replyActionArgumentsSchema,
  execute: async (context) => {
    const { message, args } = context;
    const text = applyPlaceholders(context, args.content);
    await message.reply(text);
  },
});
