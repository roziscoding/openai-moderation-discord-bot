import { guildPlugin, guildPluginEventListener } from "knub";
import OpenAI from "openai";

const openai = new OpenAI();

const CATEGORY_DFINITIONS = new Map<string, string>([
  ["sexual", "Conteúdo sexual"],
  ["sexual/minors", "Conteúdo sexual envolvendo menores"],
  ["harassment", "Assédio moral"],
  ["harassment/threatening", "Assédio moral com ameaças"],
  ["hate", "Discurso de ódio"],
  ["hate/threatening", "Discurso de ódio com ameaças"],
  ["illicit", "Atividades ilícitas"],
  ["illicit/violent", "Atividades ilícitas violentas"],
  ["self-harm", "Autoagressão"],
  ["self-harm/intent", "Autoagressão com intenção"],
  ["self-harm/instructions", "Instruções de autoagressão"],
  ["violence", "Violência"],
  ["violence/graphic", "Violência gráfica"],
]);

const onNewMessage = guildPluginEventListener({
  event: "messageCreate",
  listener: async (meta) => {
    console.log(`New message in guild ${meta.args.message.guildId}. Moderating...`);

    const {
      results: [{ flagged, categories }],
    } = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: meta.args.message.content,
    });

    if (!flagged) {
      return;
    }

    const flaggedCategories = Object.entries(categories)
      .filter(([_, value]) => value)
      .map(([key, _]) => CATEGORY_DFINITIONS.get(key) ?? key);

    await meta.args.message.reply({
      content: `${meta.args.message.author}, sua mensagem foi sinalizada para as seguintes categorias: ${flaggedCategories.join(", ")}`,
    });

    meta.args.message.deletable && (await meta.args.message.delete());
  },
});

export const moderatorPlugin = guildPlugin({
  name: "moderator",
  configParser: () => ({}),
  events: [onNewMessage],
});
