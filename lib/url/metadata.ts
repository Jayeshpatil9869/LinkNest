import { extractDomain, normalizeUrl } from "@/lib/url/normalize";
import { resolvePreviewImage, screenshotUrl } from "@/lib/url/preview-image";
import type { UrlPreview } from "@/types/url";

const FETCH_TIMEOUT_MS = 8_000;

function absoluteUrl(base: string, maybeRelative: string | null): string | null {
  if (!maybeRelative) return null;
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return null;
  }
}

function metaContent(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const propertyMatch = html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
        "i",
      ),
    );
    if (propertyMatch?.[1]) return decodeHtml(propertyMatch[1]);

    const contentFirst = html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
        "i",
      ),
    );
    if (contentFirst?.[1]) return decodeHtml(contentFirst[1]);
  }
  return null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function titleFromHtml(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1].trim()) : null;
}

function faviconFromHtml(html: string, base: string): string | null {
  const match = html.match(
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i,
  );
  if (match?.[1]) return absoluteUrl(base, match[1]);
  return absoluteUrl(base, "/favicon.ico");
}

export async function fetchUrlMetadata(rawUrl: string): Promise<UrlPreview> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const domain = extractDomain(rawUrl);
  const fallbackImage = screenshotUrl(normalizedUrl);
  const fallback: UrlPreview = {
    url: rawUrl.trim(),
    normalizedUrl,
    title: domain,
    description: null,
    domain,
    faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    previewImage: fallbackImage,
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LinkNestPreview/1.0; +https://localhost)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) return fallback;

    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml")
    ) {
      return fallback;
    }

    const html = (await response.text()).slice(0, 500_000);
    const title =
      metaContent(html, ["og:title", "twitter:title"]) ??
      titleFromHtml(html) ??
      domain;
    const description =
      metaContent(html, [
        "og:description",
        "twitter:description",
        "description",
      ]) ?? null;
    const ogImage = absoluteUrl(
      normalizedUrl,
      metaContent(html, ["og:image", "twitter:image"]),
    );
    const faviconUrl =
      faviconFromHtml(html, normalizedUrl) ?? fallback.faviconUrl;

    return {
      url: rawUrl.trim(),
      normalizedUrl,
      title,
      description,
      domain,
      faviconUrl,
      previewImage: resolvePreviewImage(normalizedUrl, ogImage),
    };
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}
