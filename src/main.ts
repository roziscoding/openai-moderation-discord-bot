import process from "node:process";
import { Client, GatewayIntentBits } from "discord.js";
import { Knub } from "knub";
import { moderatorPlugin } from "./plugins/moderation/plugin";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const knub = new Knub(client, {
  guildPlugins: [moderatorPlugin],
});

knub.initialize();
client.login(Bun.env.DISCORD_BOT_TOKEN);

// suppress warnings from discord.js about clientReady event
process.on("warning", (error) => {
  if (error.message.includes("clientReady")) {
    return;
  }

  console.warn(error);
});
