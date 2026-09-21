"use strict";

const path = require("path");
const dotenv = require("dotenv");

let loaded = false;

function loadEnv() {
  if (loaded) return;
  // Credentials live only in backend/.env locally.
  // On Vercel, platform env vars are already in process.env.
  const backendEnv = path.join(__dirname, "..", "..", ".env");
  dotenv.config({ path: backendEnv });
  loaded = true;
}

function getEnv() {
  loadEnv();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !String(supabaseUrl).trim()) {
    throw new Error("Missing required environment variable: SUPABASE_URL");
  }
  if (!serviceRoleKey || !String(serviceRoleKey).trim()) {
    throw new Error(
      "Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return {
    port: Number(process.env.PORT || 4000),
    host: process.env.HOST || "0.0.0.0",
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: parseCorsOrigins(
      process.env.CORS_ORIGIN ||
        "http://localhost:3000,http://192.168.1.6:3000",
    ),
    supabaseUrl: String(supabaseUrl).trim(),
    supabaseAnonKey: supabaseAnonKey
      ? String(supabaseAnonKey).trim()
      : null,
    serviceRoleKey: String(serviceRoleKey).trim(),
  };
}

function parseCorsOrigins(value) {
  const list = String(value)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (list.length === 0) return true;
  if (list.length === 1) return list[0];
  return list;
}

module.exports = {
  loadEnv,
  getEnv,
};
