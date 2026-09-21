"use strict";

const { createClient } = require("@supabase/supabase-js");
const { getEnv } = require("./env");

let client = null;

function getSupabase() {
  if (client) return client;
  const env = getEnv();
  client = createClient(env.supabaseUrl, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return client;
}

module.exports = {
  getSupabase,
};
