import { guildPlugin, guildPluginEventListener } from "knub";
import OpenAI from "openai";
import { repositories } from "../../../database/repositories";
import { logger } from "../../../logger";
import { ACTIONS } from "./actions";
import { moderationCommand } from "./command";
import { type ModeratorPlugin, PluginConfig } from "./types";
import { runActions } from "./utils";

const openai = new OpenAI();

const onNewMessage = guildPluginEventListener<ModeratorPlugin>()({
  event: "messageCreate",
  listener: async (meta) => {
    const config = await meta.pluginData.config.getForUser(meta.args.message.author);
    logger.debug(
      { guildId: meta.args.message.guildId, messageId: meta.args.message.id },
      "📝 New message. Moderating...",
    );

    const moderationResult = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: meta.args.message.content,
    });

    const { flagged, categories } = moderationResult.results[0];

    if (!flagged) {
      logger.debug({ guildId: meta.args.message.guildId, messageId: meta.args.message.id }, "✅ Not flagged.");
      return;
    }

    const flaggedCategories = Object.entries(categories)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    logger.info(
      {
        messageContent: meta.args.message.content,
        categories: flaggedCategories,
        guildId: meta.args.message.guildId,
        messageId: meta.args.message.id,
        author: {
          id: meta.args.message.author.id,
          name: meta.args.message.author.displayName,
          username: meta.args.message.author.username,
        },
      },
      "🚩 Message flagged.",
    );

    const categoryActions = flaggedCategories
      .map((category) => config.actions[category as keyof typeof config.actions])
      .filter((actions): actions is NonNullable<typeof actions> => actions != null)
      .flat();

    const context = { message: meta.args.message, flaggedCategories, repositories, config };

    if (categoryActions.length) {
      await runActions(categoryActions, context, ACTIONS);
      return;
    }

    await runActions(config.defaultActions, context, ACTIONS);
  },
});

export const moderatorPlugin = guildPlugin<ModeratorPlugin>()({
  name: "moderator",
  configParser: (input) => {
    return PluginConfig.parse(input);
  },
  defaultConfig: {
    actions: {},
    defaultActions: [],
  },
  events: [onNewMessage],
  slashCommands: [moderationCommand],
});
