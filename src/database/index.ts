import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig } from "../config";
import { schema } from "./schema";

const pool = new Pool({
  connectionString: appConfig.database.url,
});

const db = drizzle(pool, { schema });

export const info = {
  connections: pool.totalCount,
  idle: pool.idleCount,
  waiting: pool.waitingCount,
  active: pool.totalCount - pool.idleCount - pool.waitingCount,
};
export default db;
export type Database = typeof db;
