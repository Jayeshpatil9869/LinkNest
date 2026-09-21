"use strict";

const { loadEnv, getEnv } = require("../src/lib/env");
const { getSupabase } = require("../src/lib/supabase");

async function main() {
  loadEnv();
  const env = getEnv();
  const base = `http://${env.host === "0.0.0.0" ? "127.0.0.1" : env.host}:${env.port}`;
  const stamp = Date.now();
  const testUrl = `https://example.com/linknest-smoke-${stamp}`;

  console.log("Smoke test: POST", testUrl);

  const createRes = await fetch(`${base}/api/urls`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: testUrl,
      title: "LinkNest smoke test",
      description: "Automated persistence check",
      tags: ["smoke"],
    }),
  });

  const createBody = await createRes.json().catch(() => ({}));
  if (createRes.status !== 201) {
    throw new Error(
      `POST /api/urls failed: ${createRes.status} ${JSON.stringify(createBody)}`,
    );
  }

  const id = createBody.id;
  if (!id) throw new Error("POST response missing id");

  const listRes = await fetch(`${base}/api/urls`);
  const listBody = await listRes.json();
  if (!listRes.ok) {
    throw new Error(`GET /api/urls failed: ${listRes.status}`);
  }
  const foundInApi = (listBody.urls || []).some((row) => row.id === id);
  if (!foundInApi) {
    throw new Error("Created url not returned by GET /api/urls");
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("urls")
    .select("id, url, normalized_url")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error(
      `Row not found in Supabase urls table: ${error?.message || "no data"}`,
    );
  }

  console.log("Confirmed in database:", {
    id: data.id,
    url: data.url,
    normalized_url: data.normalized_url,
  });

  const delRes = await fetch(`${base}/api/urls/${id}`, { method: "DELETE" });
  if (delRes.status !== 204) {
    throw new Error(`Cleanup DELETE failed: ${delRes.status}`);
  }

  console.log("Smoke test passed — link persisted in Supabase and cleaned up.");
}

main().catch((error) => {
  console.error("Smoke test failed:", error.message || error);
  process.exit(1);
});
