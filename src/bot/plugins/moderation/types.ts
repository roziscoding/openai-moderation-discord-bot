import type { BasePluginType } from "knub";
import { z } from "zod";
import { ModerationAction } from "./actions";

export const Categories = z.enum([
  "sexual", // Conteúdo sexual
  "sexual/minors", // Conteúdo sexual envolvendo menores
  "harassment", // Assédio moral
  "harassment/threatening", // Assédio moral com ameaças
  "hate", // Discurso de ódio
  "hate/threatening", // Discurso de ódio com ameaças
  "illicit", // Atividades ilícitas
  "illicit/violent", // Atividades ilícitas violentas
  "self-harm", // Autoagressão
  "self-harm/intent", // Autoagressão com intenção
  "self-harm/instructions", // Instruções de autoagressão
  "violence", // Violência
  "violence/graphic", // Violência gráfica
] as const);

export const PluginConfig = z.strictObject({
  actions: z.partialRecord(Categories, z.array(ModerationAction)).optional().default({}),
  defaultActions: z.array(ModerationAction).optional().default([]),
  adminRoleId: z.string().optional().default(""),
});

export type PluginConfig = z.infer<typeof PluginConfig>;
export interface ModeratorPlugin extends BasePluginType {
  config: PluginConfig;
}
