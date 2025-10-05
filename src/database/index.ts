import { drizzle } from "drizzle-orm/node-postgres";
import { appConfig } from "../config";
import { schema } from "./schema";

const db = drizzle(appConfig.database.url, { schema });

export default db;
export type Database = typeof db;
