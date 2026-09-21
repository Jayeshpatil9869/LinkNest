"use strict";

const raw = [
  "https://motion-primitives.com/",
  "https://app.haikei.app/",
  "https://www.realtimecolors.com/",
  "https://animmasterlib.dev/",
  "https://skiper-ui.com/components",
  "https://21st.dev/",
  "https://www.vengenceui.com/",
  "https://ui.unlumen.com/",
  "https://magicui.design/",
  "https://smoothui.dev/",
  "https://retroui.io/",
  "https://ui-ux-pro-max-skill.com/",
  "https://gsap.com/",
  "https://lenis.dev/",
  "https://reactbits.dev/pro/components",
  "https://shuffle.dev/components/all/all/headers",
  "https://www.awwwards.com/awwwards/collections/free-fonts/",
  "https://www.untitledui.com/react/marketing/footers",
  "https://daisyui.com/components/footer/?lang=en",
  "https://www.footer.design/",
  "https://tympanus.net/codrops/tag/page-transition/",
  "https://motion.dev/ui/page-transitions",
  "https://www.details.so/inspo/category/page-transition",
  "https://webflow.com/templates/search-v2?query=d2c%20e-commerce%20%2B%20single-brand%20ayurvedic%20wellness%20awwwards",
  "https://www.awwwards.com/inspiration_search/d2c%20e-commerce%20%2B%20single-brand%20ayurvedic%20wellness%20a/",
  "https://uiuxshowcase.com/resources/godly-website/",
  "https://shaders.com/presets",
  "https://spline.design/",
  "https://www.framer.com/marketplace/templates/",
  "https://horizonx.so/",
  "https://omma.build/community",
  "https://www.footer.design/",
  "https://www.dark.design/",
  "https://designspells.com/",
  "https://60fps.design/",
  "https://mui.com/material-ui/",
  "https://uiverse.io/",
  "https://ui.aceternity.com/",
  "https://ionicframework.com/docs/components",
  "https://shuffle.dev/components",
  "https://createui.co/",
  "https://ui.spectrumhq.in/",
  "https://motion.dev/",
  "https://www.framer.com/marketplace/components/",
  "https://collectui.com/",
  "https://www.bagui.pro/",
  "https://www.darkmodedesign.com/",
  "https://ui.watermelon.sh/home",
  "https://www.brandingwebsite.com/",
  "https://the-brandidentity.com/",
  "https://www.details.so/inspo/category/blog",
  "https://www.scrolltide.co/",
  "https://threeui.com/browse",
];

const TRACKING = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src",
]);

function normalizeUrl(input) {
  const trimmed = input.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase();
  if (
    (url.protocol === "http:" && url.port === "80") ||
    (url.protocol === "https:" && url.port === "443")
  ) {
    url.port = "";
  }
  const params = url.searchParams;
  for (const key of [...params.keys()]) {
    if (TRACKING.has(key.toLowerCase())) params.delete(key);
  }
  let pathname = url.pathname;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  url.pathname = pathname || "/";
  url.hash = "";
  return url.toString();
}

const seen = new Map();
const unique = [];
const removed = [];

for (const original of raw) {
  const normalized = normalizeUrl(original);
  if (seen.has(normalized)) {
    removed.push({ original, duplicateOf: seen.get(normalized), normalized });
    continue;
  }
  seen.set(normalized, original);
  unique.push({ original, normalized });
}

const BASE = process.env.API_BASE || "http://127.0.0.1:4000";

async function addOne(item, index, total) {
  process.stdout.write(`[${index + 1}/${total}] ${item.original} ... `);

  let preview = null;
  try {
    const previewRes = await fetch(`${BASE}/api/urls/preview`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url: item.original }),
    });
    if (previewRes.status === 409) {
      const body = await previewRes.json();
      console.log(`SKIP duplicate (already in DB): ${body.url?.title || body.url?.id}`);
      return { status: "skipped", item };
    }
    if (previewRes.ok) {
      preview = await previewRes.json();
    }
  } catch {
    // continue with bare create
  }

  const payload = preview
    ? {
        url: preview.url,
        title: preview.title,
        description: preview.description,
        faviconUrl: preview.faviconUrl,
        previewImage: preview.previewImage,
      }
    : { url: item.original };

  const createRes = await fetch(`${BASE}/api/urls`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (createRes.status === 409) {
    console.log("SKIP duplicate");
    return { status: "skipped", item };
  }
  if (!createRes.ok) {
    const err = await createRes.text();
    console.log(`FAIL ${createRes.status} ${err.slice(0, 120)}`);
    return { status: "failed", item, error: err };
  }
  const record = await createRes.json();
  console.log(`OK → ${record.title}`);
  return { status: "created", item, record };
}

async function main() {
  console.log(
    `Input: ${raw.length} · Unique: ${unique.length} · Removed duplicates: ${removed.length}`,
  );
  if (removed.length) {
    console.log("Removed:");
    for (const d of removed) {
      console.log(`  - ${d.original}  (same as ${d.duplicateOf})`);
    }
  }
  console.log("");

  const results = { created: 0, skipped: 0, failed: 0 };
  for (let i = 0; i < unique.length; i += 1) {
    const result = await addOne(unique[i], i, unique.length);
    results[result.status === "created" ? "created" : result.status === "skipped" ? "skipped" : "failed"] += 1;
    // brief pause so we don't hammer preview fetches
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log("\nDone:", results);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
