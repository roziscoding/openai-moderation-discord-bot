import db from "..";
import { GuildRepository } from "./guild.repository";
import { StrikesRepository } from "./strikes.repository";

export const repositories = {
  guild: new GuildRepository(db),
  strikes: new StrikesRepository(db),
};
