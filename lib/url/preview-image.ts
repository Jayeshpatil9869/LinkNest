/**
 * Website preview image helpers.
 * Prefer Open Graph images when available; otherwise use a live screenshot service.
 */

export function screenshotUrl(pageUrl: string, width = 1200): string {
  const clean = pageUrl.replace(/\/$/, "") || pageUrl;
  // thum.io — live website screenshots, no API key
  return `https://image.thum.io/get/width/${width}/crop/${Math.round(width * 0.75)}/${clean}`;
}

export function resolvePreviewImage(
  pageUrl: string,
  existing: string | null | undefined,
): string {
  if (existing && existing.trim().length > 0) return existing;
  return screenshotUrl(pageUrl);
}
