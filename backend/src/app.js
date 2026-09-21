"use strict";

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const helmet = require("@fastify/helmet");
const { getEnv } = require("./lib/env");
const healthRoutes = require("./routes/health");
const urlsRoutes = require("./routes/urls");

async function buildApp(options = {}) {
  const env = getEnv();
  const isProd = env.nodeEnv === "production";

  const app = Fastify({
    logger: options.logger ?? {
      level: isProd ? "info" : "debug",
    },
    bodyLimit: 1_048_576,
    trustProxy: true,
    ...options.fastify,
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: env.corsOrigin,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
  });

  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(urlsRoutes, { prefix: "/api" });

  return app;
}

module.exports = {
  buildApp,
};
