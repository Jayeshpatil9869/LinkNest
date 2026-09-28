"use strict";

const Fastify = require("fastify");
const cors = require("@fastify/cors");
const helmet = require("@fastify/helmet");
const multipart = require("@fastify/multipart");
const { getEnv } = require("./lib/env");
const healthRoutes = require("./routes/health");
const urlsRoutes = require("./routes/urls");
const uploadRoutes = require("./routes/uploads");

async function buildApp(options = {}) {
  const env = getEnv();
  const isProd = env.nodeEnv === "production";

  const app = Fastify({
    logger: options.logger ?? {
      level: isProd ? "info" : "debug",
    },
    bodyLimit: 8_388_608,
    trustProxy: true,
    ...options.fastify,
  });

  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false,
  });

  await app.register(cors, {
    origin: env.corsOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 8 * 1024 * 1024,
      files: 1,
    },
  });

  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(urlsRoutes, { prefix: "/api" });
  await app.register(uploadRoutes, { prefix: "/api" });

  return app;
}

module.exports = {
  buildApp,
};
