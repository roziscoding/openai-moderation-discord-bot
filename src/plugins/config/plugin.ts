import { guildPlugin } from "knub";
import { configCommand } from "./commands/config.command";

export const configPlugin = guildPlugin({
  name: "config",
  configParser: () => ({}),
  slashCommands: [configCommand],
});
