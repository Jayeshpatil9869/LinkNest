import { z } from "zod";
import { URL_CATEGORIES, type UrlCategory } from "@/types/url";

export const urlStringSchema = z
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

export const createUrlSchema = z.object({
  url: urlStringSchema,
  title: z.string().trim().max(200).optional(),
  description: z.string().trim().max(600).nullable().optional(),
  category: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  faviconUrl: z.string().url().nullable().optional(),
  previewImage: z.string().url().nullable().optional(),
});

export const previewRequestSchema = z.object({
  url: urlStringSchema,
});

export type CreateUrlFormValues = z.infer<typeof createUrlSchema>;

export function normalizeCategory(
  value: string | null | undefined,
): UrlCategory | null {
  if (!value) return null;
  return (URL_CATEGORIES as string[]).includes(value)
    ? (value as UrlCategory)
    : null;
}
