import { MessageFlags } from "discord.js";
import { guildPluginSlashCommand, guildPluginSlashGroup, slashOptions } from "knub";
import { repositories } from "../../database/repositories";
import type { ModeratorPlugin } from "./types";

const setAdminRoleCommand = guildPluginSlashCommand<ModeratorPlugin>()({
  name: "adminrole",
  description: "Set the admin role for the moderation plugin",
  signature: [slashOptions.role({ name: "role", description: "The role to set as admin" })],
  allowDms: false,
  run: async (context) => {
    if (!context.interaction.guildId) {
      await context.interaction.reply({
        content: "This command can only be used in a guild.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const role = context.interaction.options.getRole("role");

    if (!role) {
      const config = await context.pluginData.config.getForUser(context.interaction.user);
      const currentAdminRole = config.adminRoleId;

      if (currentAdminRole) {
        await context.interaction.reply({
          content: `Current admin role: <@&${currentAdminRole}>`,
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await context.interaction.reply({
        content: "No admin role set",
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await repositories.guild.setConfig(context.interaction.guildId, {
      ...context.pluginData.fullConfig,
      plugins: {
        ...context.pluginData.fullConfig.plugins,
        moderator: {
          ...context.pluginData.fullConfig.plugins.moderator,
          config: {
            ...context.pluginData.fullConfig.plugins.moderator.config,
            adminRoleId: role.id,
          },
        },
      },
    });

    await context.pluginData.getKnubInstance().reloadGuild(context.interaction.guildId);

    await context.interaction.reply({
      content: `Set admin role to ${role}`,
      flags: [MessageFlags.Ephemeral],
    });
  },
});

export const moderationCommand = guildPluginSlashGroup<ModeratorPlugin>()({
  name: "moderation",
  description: "Moderation commands",
  subcommands: [setAdminRoleCommand],
});
