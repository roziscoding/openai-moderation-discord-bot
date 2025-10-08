import { globalPlugin, globalPluginEventListener } from "knub";
import { repositories } from "../../../database/repositories";

const onNewGuild = globalPluginEventListener({
  event: "guildCreate",
  listener: async (meta) => {
    await repositories.guild.create(meta.args.guild.id, meta.args.guild.name);
  },
});

export const newGuildPlugin = globalPlugin({
  name: "new-guild",
  configParser: () => ({}),
  events: [onNewGuild],
});
