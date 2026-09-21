"use strict";

/**
 * Vercel Node serverless entry for /api/*
 * Uses the shared Fastify app factory in backend/src.
 */
module.exports = require("../backend/src/vercel.js");
