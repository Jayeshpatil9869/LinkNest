"use strict";

const { loadEnv, getEnv } = require("./lib/env");
const { buildApp } = require("./app");

async function main() {
  loadEnv();
  const env = getEnv();
  const app = await buildApp();

  try {
    await app.listen({ port: env.port, host: env.host });
    app.log.info(`LinkNest API listening on http://${env.host}:${env.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

main();
