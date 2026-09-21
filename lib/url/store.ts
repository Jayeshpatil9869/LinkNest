import type { CreateUrlInput, UrlRecord } from "@/types/url";
import { extractDomain, normalizeUrl } from "@/lib/url/normalize";
import { resolvePreviewImage } from "@/lib/url/preview-image";

type GlobalStore = {
  urls: Map<string, UrlRecord>;
  byNormalized: Map<string, string>;
};

/** Bump key when store shape changes so hot reload drops stale in-memory data. */
const globalKey = "__linknest_url_store_v4__";

function getStore(): GlobalStore {
  const g = globalThis as typeof globalThis & {
    [globalKey]?: GlobalStore;
  };

  if (!g[globalKey]) {
    g[globalKey] = {
      urls: new Map(),
      byNormalized: new Map(),
    };
  }

  return g[globalKey];
}

export function listUrls(): UrlRecord[] {
  return [...getStore().urls.values()].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function findByNormalized(normalizedUrl: string): UrlRecord | null {
  const store = getStore();
  const id = store.byNormalized.get(normalizedUrl);
  if (!id) return null;
  return store.urls.get(id) ?? null;
}

export function findById(id: string): UrlRecord | null {
  return getStore().urls.get(id) ?? null;
}

export function createUrl(input: CreateUrlInput): {
  record: UrlRecord;
  duplicate: boolean;
} {
  const normalizedUrl = normalizeUrl(input.url);
  const existing = findByNormalized(normalizedUrl);
  if (existing) {
    return { record: existing, duplicate: true };
  }

  const domain = extractDomain(input.url);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const record: UrlRecord = {
    id,
    url: input.url.trim(),
    normalizedUrl,
    title: input.title?.trim() || domain,
    description: input.description?.trim() || null,
    domain,
    faviconUrl:
      input.faviconUrl ??
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
    previewImage: resolvePreviewImage(input.url, input.previewImage),
    category: input.category ?? null,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };

  const store = getStore();
  store.urls.set(id, record);
  store.byNormalized.set(normalizedUrl, id);
  return { record, duplicate: false };
}

export function deleteUrl(id: string): boolean {
  const store = getStore();
  const existing = store.urls.get(id);
  if (!existing) return false;
  store.urls.delete(id);
  store.byNormalized.delete(existing.normalizedUrl);
  return true;
}
