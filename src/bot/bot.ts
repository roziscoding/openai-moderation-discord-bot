import { Client, GatewayIntentBits } from "discord.js";
import { Knub } from "knub";
import { repositories } from "../database/repositories";
import { logFn, logger } from "../logger";
import { configPlugin } from "./plugins/config/plugin";
import { moderatorPlugin } from "./plugins/moderation/plugin";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const knub = new Knub(client, {
  guildPlugins: [moderatorPlugin, configPlugin],
  options: {
    logFn,
    async getConfig(id) {
      const config = await repositories.guild.getOrInitializeConfig(id);
      return config ?? { plugins: { moderator: { a: "b" } } };
    },
  },
});

let startTime = 0;

export default {
  start: async () => {
    knub.initialize();
    await client.login(Bun.env.DISCORD_BOT_TOKEN);
    startTime = Date.now();
    logger.info(`🤖 Bot started as ${client.user?.tag}`);
  },
  stop: async () => {
    await client.destroy();
  },
  isReady: () => {
    return client.isReady();
  },
  get uptime() {
    return Date.now() - startTime;
  },
};
