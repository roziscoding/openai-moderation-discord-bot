import { Client, GatewayIntentBits } from "discord.js";
import { guildPlugin, guildPluginEventListener, Knub } from "knub";
import process from "node:process";
import OpenAI from "openai";

const openai = new OpenAI();

const onNewMessage = guildPluginEventListener({
  event: "messageCreate",
  listener: async (meta) => {
    console.log(
      `New message in guild ${meta.args.message.guildId}. Moderating...`,
    );

    const {
      results: [{ flagged, categories }],
    } = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: meta.args.message.content,
    });

    if (flagged) {
      const flaggedCategories = Object.entries(categories)
        .filter(([_, value]) => value)
        .map(([key, _]) => key);

      console.log(
        `Message flagged for categories: ${flaggedCategories.join(", ")}`,
      );
      await meta.args.message.reply({
        content: `${meta.args.message.author}, your message was flagged for the following categories: ${flaggedCategories.join(", ")}`,
      });
      meta.args.message.deletable && (await meta.args.message.delete());
    }
  },
});

const moderatorPlugin = guildPlugin({
  name: "moderator",
  configParser: () => ({}),
  events: [onNewMessage],
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const knub = new Knub(client, {
  guildPlugins: [moderatorPlugin],
});

knub.initialize();
client.login(Bun.env.DISCORD_BOT_TOKEN);

process.on("warning", () => {}); // suppress warnings from discord.js about clientReady event
