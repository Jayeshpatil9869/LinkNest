"use strict";

const { getSupabase } = require("../src/lib/supabase");

function classify(url, domain) {
  const u = url.toLowerCase();
  const d = (domain || "").toLowerCase();

  if (d.includes("siellabeauty") || d.includes("waterfieldadvisors")) {
    return "Reference";
  }
  if (u.includes("free-fonts")) return "Resources";
  if (d.includes("tympanus") || d.includes("the-brandidentity")) return "Articles";
  if (
    [
      "realtimecolors.com",
      "haikei.app",
      "spline.design",
      "shaders.com",
      "getdesign.md",
      "ui-ux-pro-max-skill.com",
    ].some((host) => d.includes(host))
  ) {
    return "Tools";
  }
  if (
    [
      "gsap.com",
      "lenis.dev",
      "motion.dev",
      "mui.com",
      "ionicframework.com",
      "daisyui.com",
      "reactbits.dev",
      "threeui.com",
    ].some((host) => d.includes(host))
  ) {
    return "Development";
  }
  if (u.includes("framer.com/marketplace/templates")) return "Inspiration";
  if (
    [
      "awwwards.com",
      "collectui.com",
      "dark.design",
      "darkmodedesign.com",
      "60fps.design",
      "designspells.com",
      "uiuxshowcase.com",
      "footer.design",
      "details.so",
      "brandingwebsite.com",
      "scrolltide.co",
      "webflow.com",
    ].some((host) => d.includes(host))
  ) {
    return "Inspiration";
  }
  return "Design";
}

async function main() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("urls")
    .select("id, url, domain, category");
  if (error) throw error;

  const counts = {};
  const failed = [];

  for (const row of data) {
    let category = classify(row.url, row.domain);
    let result = await supabase
      .from("urls")
      .update({
        category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id)
      .select("id, category")
      .maybeSingle();

    if (result.error?.code === "23514" && category === "Reference") {
      category = "Inspiration";
      result = await supabase
        .from("urls")
        .update({
          category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .select("id, category")
        .maybeSingle();
      failed.push(row.url);
    }

    if (result.error) {
      console.error("FAIL", row.url, result.error.message);
      continue;
    }

    counts[category] = (counts[category] || 0) + 1;
    console.log(`${category.padEnd(12)} ${row.domain}`);
  }

  console.log("\nCounts", counts);
  if (failed.length) {
    console.log(
      "Reference blocked by database check; saved as Inspiration:",
      failed,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
