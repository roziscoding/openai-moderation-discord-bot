import type { Server } from "bun";
import { Hono } from "hono";
import { format } from "ms";
import { logger } from "../logger";
import { authRoute } from "./routes/auth";
import { healthcheckRoute } from "./routes/healthcheck";

const PORT = Number(Bun.env.PORT ?? "3000");

const app = new Hono();

app.use((c, next) => {
  const start = performance.now();
  return next().then(() => {
    const duration = performance.now() - start;
    logger.info(`[${c.req.method}] ${c.req.path} - ${format(Math.round(duration))}`);
  });
});

app.route("/healthcheck", healthcheckRoute);
app.route("/auth", authRoute);

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
