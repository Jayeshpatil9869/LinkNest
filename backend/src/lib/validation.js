"use strict";

const { z } = require("zod");

const URL_CATEGORIES = [
  "Design",
  "Development",
  "Inspiration",
  "Tools",
  "Articles",
  "Resources",
];

const urlStringSchema = z
  .string()
  .trim()
  .min(1, "Paste a URL worth remembering.")
  .refine((value) => {
    try {
      const withProtocol = /^https?:\/\//i.test(value)
        ? value
        : `https://${value}`;
      const parsed = new URL(withProtocol);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a valid http(s) URL.");

const createUrlSchema = z.object({
  url: urlStringSchema,
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(600).nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  faviconUrl: z.string().url().nullable().optional(),
  previewImage: z.string().url().nullable().optional(),
});

const previewRequestSchema = z.object({
  url: urlStringSchema,
});

function normalizeCategory(value) {
  if (!value) return null;
  return URL_CATEGORIES.includes(value) ? value : null;
}

module.exports = {
  URL_CATEGORIES,
  createUrlSchema,
  previewRequestSchema,
  normalizeCategory,
};
