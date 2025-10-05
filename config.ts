import type { PluginConfig } from "./src/plugins/moderation/types";

const config: PluginConfig = {
  actions: {
    sexual: [
      {
        action: "strike",
        arguments: {
          ttl: "30d",
          perReason: true,
          maxStrikes: 3,
          onMaxStrikes: [],
          strikeMessage: "Please do not use sexual language. You have {currentStrike} out of {maxStrikes} strikes.",
          maxStrikesMessage: "You have messed up too many times. You are now banned.",
        },
      },
    ],
    harassment: [
      {
        action: "strike",
        arguments: {
          ttl: "30d",
          perReason: true,
          maxStrikes: 3,
          onMaxStrikes: [],
          strikeMessage: "Please do not harass others. You have {currentStrike} out of {maxStrikes} strikes.",
          maxStrikesMessage: "You have messed up too many times. You are now banned.",
        },
      },
    ],
  },
  defaultActions: [
    {
      action: "report",
      arguments: {
        adminRoleId: "1139748885871476786",
        reportMessage: "{adminMention} {flaggedCategories}",
      },
    },
  ],
};

const serverConfig = {
  plugins: {
    moderator: {
      config,
    },
  },
};

console.log(JSON.stringify(serverConfig, null, 2));
