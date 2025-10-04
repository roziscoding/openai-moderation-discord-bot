import type z from "zod";
import { deleteMessageAction } from "./delete-message";
import { replyAction } from "./reply";
import { strikeAction } from "./strike";

export const ACTIONS = {
  delete: deleteMessageAction,
  reply: replyAction,
  strike: strikeAction,
};

export type ModerationActions = {
  [K in keyof typeof ACTIONS]: z.input<(typeof ACTIONS)[K]["arguments"]> extends undefined
    ? [K]
    : [K, z.input<(typeof ACTIONS)[K]["arguments"]>];
}[keyof typeof ACTIONS][];
