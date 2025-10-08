import type { Server } from "bun";
import { Hono } from "hono";
import { logger } from "../logger";
import { healthcheckRoute } from "./routes/healthcheck";

const PORT = Number(Bun.env.PORT ?? "3000");

const app = new Hono();

app.route("/", healthcheckRoute);

let server: Server | null = null;

export default {
  start: async () => {
    server = Bun.serve({
      port: PORT,
      fetch: app.fetch,
    });
  },
  stop: async () => {
    server?.stop();
  },
};

logger.info(`🚀 Server is running on port ${PORT}`);
