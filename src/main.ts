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

await Bun.serve({
  port: 3000,
  fetch: (req) => {
    const url = new URL(req.url);
    if (url.pathname === "/health") {
      if (!client.isReady()) {
        return new Response("Bot is not ready", { status: 500 });
      }
      return new Response("OK", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Health check is running on port ${Bun.env.PORT}`);

knub.initialize();
await client.login(Bun.env.DISCORD_BOT_TOKEN);

// suppress warnings from discord.js about clientReady event
process.on("warning", (error) => {
  if (error.message.includes("clientReady")) {
    return;
  }

  console.warn(error);
});
