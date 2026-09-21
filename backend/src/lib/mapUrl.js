"use strict";

function screenshotUrl(pageUrl, width = 1200) {
  const clean = pageUrl.replace(/\/$/, "") || pageUrl;
  return `https://image.thum.io/get/width/${width}/crop/${Math.round(width * 0.75)}/${clean}`;
}

function resolvePreviewImage(pageUrl, existing) {
  if (existing && String(existing).trim().length > 0) return existing;
  return screenshotUrl(pageUrl);
}

function rowToRecord(row) {
  return {
    id: row.id,
    url: row.url,
    normalizedUrl: row.normalized_url,
    title: row.title,
    description: row.description ?? null,
    domain: row.domain,
    faviconUrl: row.favicon_url ?? null,
    previewImage: row.preview_image ?? null,
    category: row.category ?? null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function recordToInsert(input) {
  const now = new Date().toISOString();
  return {
    url: input.url,
    normalized_url: input.normalizedUrl,
    title: input.title,
    description: input.description,
    domain: input.domain,
    favicon_url: input.faviconUrl,
    preview_image: input.previewImage,
    category: input.category,
    tags: input.tags,
    created_at: now,
    updated_at: now,
  };
}

module.exports = {
  screenshotUrl,
  resolvePreviewImage,
  rowToRecord,
  recordToInsert,
};
