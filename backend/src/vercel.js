"use strict";

const { buildApp } = require("./app");

let appPromise = null;

function getApp() {
  if (!appPromise) {
    appPromise = buildApp().then(async (app) => {
      await app.ready();
      return app;
    });
  }
  return appPromise;
}

/**
 * Vercel / Node serverless handler — same Fastify app as local server.js.
 */
async function handler(req, res) {
  const app = await getApp();
  app.server.emit("request", req, res);
}

module.exports = handler;
