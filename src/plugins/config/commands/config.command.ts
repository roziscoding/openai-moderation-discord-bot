import { MessageFlags } from "discord.js";
import { guildPluginSlashCommand, guildPluginSlashGroup, slashOptions } from "knub";
import { repositories } from "../../../database/repositories";
import type { ModeratorPlugin } from "../../moderation/types";

const getCommand = guildPluginSlashCommand<ModeratorPlugin>()({
  name: "get",
  description: "Get the config",
  signature: [
    slashOptions.string({
      name: "plugin",
      description: "The plugin to get the config for",
    }),
  ],
  run: async (context) => {
    const pluginName = context.interaction.options.getString("plugin");
    const fullConfig = context.pluginData.fullConfig;

    const availablePlugins = context.pluginData.getKnubInstance().getAvailablePlugins();

    if (pluginName && !availablePlugins.has(pluginName)) {
      const availablePluginsList = Array.from(availablePlugins.keys())
        .map((plugin) => `\`${plugin}\``)
        .join(", ");

      await context.interaction.reply({
        content: `Invalid plugin. Available plugins: ${availablePluginsList}`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const config = (pluginName ? fullConfig.plugins[pluginName].config : fullConfig) ?? {};

    await context.interaction.reply(`\`\`\`json\n${JSON.stringify(config, null, 2)}\`\`\``);
  },
});

const reloadCommand = guildPluginSlashCommand<ModeratorPlugin>()({
  name: "reload",
  description: "Reload configuration for all plugins",
  signature: [],
  run: async (context) => {
    if (!context.interaction.guildId) {
      await context.interaction.reply({
        content: "This command can only be used in a guild.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const message = await context.interaction.reply({
      content: "Reloading config...",
      flags: [MessageFlags.Ephemeral],
    });
    await context.pluginData.getKnubInstance().reloadGuild(context.interaction.guildId);
    await message.edit("Config reloaded");
  },
});

const setCommand = guildPluginSlashCommand<ModeratorPlugin>()({
  name: "set",
  description: "Set the config for a plugin",
  signature: [
    slashOptions.string({
      name: "plugin",
      description: "The plugin to set the config for",
      required: true,
    }),
    slashOptions.string({
      name: "config",
      description: "The config to set for the plugin",
      required: true,
    }),
  ],
  run: async (context) => {
    if (!context.interaction.guildId) {
      await context.interaction.reply({
        content: "This command can only be used in a guild.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const pluginName = context.interaction.options.getString("plugin");
    if (!pluginName) {
      await context.interaction.reply({
        content: "Please provide a plugin name.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const config = context.interaction.options.getString("config");

    if (!config) {
      await context.interaction.reply({
        content: "Please provide a config.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const availablePlugins = context.pluginData.getKnubInstance().getAvailablePlugins();
    const availablePluginsList = Array.from(availablePlugins.keys())
      .map((plugin) => `\`${plugin}\``)
      .join(", ");

    if (!availablePlugins.has(pluginName)) {
      await context.interaction.reply({
        content: `Invalid plugin. Available plugins: ${availablePluginsList}`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    let parsedConfig: unknown;
    try {
      parsedConfig = JSON.parse(config);
    } catch (error) {
      await context.interaction.reply({
        content: `Invalid config. ${error instanceof Error ? error.message : "Unknown error while parsing config"}`,
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const fullConfig = structuredClone(context.pluginData.fullConfig);
    fullConfig.plugins ??= {};
    fullConfig.plugins[pluginName] = { config: parsedConfig };
    await repositories.guild.setConfig(context.interaction.guildId, fullConfig);
    await context.pluginData.getKnubInstance().reloadGuild(context.interaction.guildId);
    await context.interaction.reply({
      content: "Config set and reloaded",
      flags: [MessageFlags.Ephemeral],
    });
  },
});

export const configCommand = guildPluginSlashGroup<ModeratorPlugin>()({
  name: "config",
  description: "Config commands",
  subcommands: [getCommand, reloadCommand, setCommand],
});
