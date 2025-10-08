import process from "node:process";
import { Hono } from "hono";
import { format } from "ms";
import bot from "../../bot/bot";
import db, { info } from "../../database";

export const healthcheckRoute = new Hono();

healthcheckRoute.get("/healthcheck", async (c) => {
  const status = {
    server: {
      status: "ok",
      uptime: format(process.uptime() * 1000, { long: true }),
    },
    bot: {
      status: bot.isReady() ? "ok" : "not ready",
      uptime: format(bot.uptime, { long: true }),
    },
    database: {
      status: db.$client.ended ? "not ready" : "ok",
      info,
    },
  };

  const httpStatus =
    status.server.status === "ok" && status.bot.status === "ok" && status.database.status === "ok" ? 200 : 500;

  return c.json(status, httpStatus);
});
