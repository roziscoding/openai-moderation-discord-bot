import type { GuildMessage } from "knub/dist/types";
import type OpenAI from "openai";
import { z } from "zod";

export type ActionContext<TArgSchema extends z.ZodType | z.ZodNever = z.ZodNever> = {
  message: GuildMessage;
  args: z.output<TArgSchema>;
  result: OpenAI.Moderations.ModerationCreateResponse;
};

export type ActionFunction<TArgSchema extends z.ZodType | z.ZodNever = z.ZodNever> = (
  context: ActionContext<TArgSchema>,
) => Promise<void>;

export interface Action<TArgSchema extends z.ZodType | z.ZodNever = z.ZodNever> {
  name: string;
  description: string;
  arguments: TArgSchema | undefined;
  execute: ActionFunction<TArgSchema>;
}

export const defineAction = <TArgSchema extends z.ZodType = z.ZodNever>(values: {
  name: string;
  description: string;
  execute: ActionFunction<TArgSchema>;
  arguments?: TArgSchema;
}) => ({
  name: values.name,
  description: values.description,
  arguments: values.arguments ?? z.undefined(),
  execute: values.execute,
});
