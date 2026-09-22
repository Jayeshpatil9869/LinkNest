import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const iconsDir = path.join(rootDir, "public", "icons");

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG template for standard icons
function createStandardSvg(size, rx = 0) {
  const fontSize = Math.round(size * 0.44);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="ln-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7D797"/>
      <stop offset="50%" stop-color="#F7C097"/>
      <stop offset="100%" stop-color="#E9A56F"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${rx}" fill="url(#ln-grad)"/>
  <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-0.04em" fill="#1C1612" text-anchor="middle" dominant-baseline="middle">LN</text>
</svg>`;
}

// SVG template for maskable icons (full bleed background, inner content inside safe 60%-70% zone)
function createMaskableSvg(size) {
  const fontSize = Math.round(size * 0.36);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="ln-grad-mask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F7D797"/>
      <stop offset="50%" stop-color="#F7C097"/>
      <stop offset="100%" stop-color="#E9A56F"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#ln-grad-mask)"/>
  <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" letter-spacing="-0.04em" fill="#1C1612" text-anchor="middle" dominant-baseline="middle">LN</text>
</svg>`;
}

async function generate() {
  const targets = [
    { name: "icon-192.png", size: 192, rx: 36, maskable: false, dir: iconsDir },
    { name: "icon-192-maskable.png", size: 192, rx: 0, maskable: true, dir: iconsDir },
    { name: "icon-512.png", size: 512, rx: 96, maskable: false, dir: iconsDir },
    { name: "icon-512-maskable.png", size: 512, rx: 0, maskable: true, dir: iconsDir },
    { name: "apple-touch-icon.png", size: 180, rx: 36, maskable: false, dir: iconsDir },
    { name: "apple-touch-icon-180x180.png", size: 180, rx: 36, maskable: false, dir: iconsDir },
    { name: "apple-touch-icon-152x152.png", size: 152, rx: 30, maskable: false, dir: iconsDir },
    { name: "apple-touch-icon-167x167.png", size: 167, rx: 33, maskable: false, dir: iconsDir },
    { name: "favicon-32x32.png", size: 32, rx: 6, maskable: false, dir: iconsDir },
    { name: "favicon-16x16.png", size: 16, rx: 3, maskable: false, dir: iconsDir },
    // Also copy apple-touch-icon to public root for default iOS crawlers
    { name: "apple-touch-icon.png", size: 180, rx: 36, maskable: false, dir: path.join(rootDir, "public") }
  ];

  for (const target of targets) {
    const svg = target.maskable
      ? createMaskableSvg(target.size)
      : createStandardSvg(target.size, target.rx);
    const dest = path.join(target.dir, target.name);
    await sharp(Buffer.from(svg)).png().toFile(dest);
    console.log(`Generated: ${dest}`);
  }
}

generate().catch(console.error);
