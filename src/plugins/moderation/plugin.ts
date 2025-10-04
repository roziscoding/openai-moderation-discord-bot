import { guildPlugin, guildPluginEventListener } from "knub";
import type { GuildMessage } from "knub/dist/types";
import OpenAI from "openai";
import type z from "zod";
import { ACTIONS, type ModerationActions } from "./actions";
import type { ActionFunction } from "./actions/action";

const openai = new OpenAI();

const CATEGORY_DFINITIONS = {
  sexual: "Conteúdo sexual",
  "sexual/minors": "Conteúdo sexual envolvendo menores",
  harassment: "Assédio moral",
  "harassment/threatening": "Assédio moral com ameaças",
  hate: "Discurso de ódio",
  "hate/threatening": "Discurso de ódio com ameaças",
  illicit: "Atividades ilícitas",
  "illicit/violent": "Atividades ilícitas violentas",
  "self-harm": "Autoagressão",
  "self-harm/intent": "Autoagressão com intenção",
  "self-harm/instructions": "Instruções de autoagressão",
  violence: "Violência",
  "violence/graphic": "Violência gráfica",
} as const;

export type PluginConfig = {
  actions: {
    [k in keyof typeof CATEGORY_DFINITIONS]?: ModerationActions;
  };
  defaultActions: ModerationActions;
};
const runActions = async (
  actions: ModerationActions,
  message: GuildMessage,
  moderationResult: OpenAI.Moderations.ModerationCreateResponse,
) => {
  for (const [action, args] of actions) {
    const actionDefinition = ACTIONS[action as keyof typeof ACTIONS];
    const validatedArgs = actionDefinition.arguments?.parse(args) as z.output<(typeof actionDefinition)["arguments"]>;
    const actionFn = actionDefinition.execute as ActionFunction<(typeof actionDefinition)["arguments"]>;
    await actionFn({ message, args: validatedArgs, result: moderationResult });
  }
};

const config: PluginConfig = {
  actions: {
    "harassment/threatening": [["reply", { content: "Ei, essa mensagem é paia ok." }]],
    "self-harm/intent": [
      ["reply", { content: "Se está se sentindo assim, por favor, entre em contato com um profissional de saúde." }],
    ],
    sexual: [
      [
        "strike",
        {
          maxStrikes: 3,
          strikeMessage: "Opa, strike {strike} de {maxStrikes}",
          maxStrikesMessage: "Okay. Já deu. Você usou suas {maxStrikes} chances.",
          onMaxStrikes: "delete",
        },
      ],
    ],
  },
  defaultActions: [["delete"]],
};

const onNewMessage = guildPluginEventListener({
  event: "messageCreate",
  listener: async (meta) => {
    console.log(`New message in guild ${meta.args.message.guildId}. Moderating...`);

    const moderationResult = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: meta.args.message.content,
    });

    const { flagged, categories } = moderationResult.results[0];

    if (!flagged) {
      console.log("Not flagged.");
      return;
    }

    const flaggedCategories = Object.entries(categories)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);

    console.log(`Flagged categories ${JSON.stringify(flaggedCategories)}.`);

    const categoryActions = flaggedCategories
      .map((category) => config.actions[category as keyof typeof config.actions])
      .filter((actions): actions is NonNullable<typeof actions> => actions != null)
      .flat();

    if (categoryActions.length) {
      await runActions(categoryActions, meta.args.message, moderationResult);
      return;
    }

    await runActions(config.defaultActions, meta.args.message, moderationResult);
  },
});

export const moderatorPlugin = guildPlugin({
  name: "moderator",
  configParser: () => ({}),
  events: [onNewMessage],
});
