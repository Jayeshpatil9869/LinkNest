"use strict";

async function healthRoutes(fastify) {
  fastify.get("/health", async () => ({
    ok: true,
    service: "linknest-api",
    time: new Date().toISOString(),
  }));
}

module.exports = healthRoutes;
