import { guilds } from "./guild";
import { strikes } from "./strike";

export const schema = {
  guilds,
  strikes,
};
export type Schema = typeof schema;

export default schema;
export * from "./guild";
export * from "./relations";
export * from "./strike";
