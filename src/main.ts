import process from "node:process";
import { Client, GatewayIntentBits } from "discord.js";
import { Knub } from "knub";
import { repositories } from "./database/repositories";
import { logFn, logger } from "./logger";
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

knub.reloadGuild("1139748885871476786");

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? "3000"),
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

logger.info(`🏥 Health check is running on port ${server.port}`);

knub.initialize();
await client.login(Bun.env.DISCORD_BOT_TOKEN);

// suppress warnings from discord.js about clientReady event
process.on("warning", (error) => {
  if (error.message.includes("clientReady")) {
    return;
  }

  logger.warn(`⚠️ ${error}`);
});

// graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`👋 \nReceived ${signal}, shutting down gracefully...`);

  try {
    await client.destroy();
    logger.info("✅ Discord client disconnected");

    server.stop();
    logger.info("🛑 HTTP server stopped");

    process.exit(0);
  } catch (error) {
    logger.error({ error }, "❌ Error during shutdown");
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
