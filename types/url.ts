export type UrlCategory =
  | "Design"
  | "Development"
  | "Inspiration"
  | "Tools"
  | "Articles"
  | "Resources";

export const URL_CATEGORIES: UrlCategory[] = [
  "Design",
  "Development",
  "Inspiration",
  "Tools",
  "Articles",
  "Resources",
];

export type UrlRecord = {
  id: string;
  url: string;
  normalizedUrl: string;
  title: string;
  description: string | null;
  domain: string;
  faviconUrl: string | null;
  previewImage: string | null;
  category: UrlCategory | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type UrlPreview = {
  url: string;
  normalizedUrl: string;
  title: string;
  description: string | null;
  domain: string;
  faviconUrl: string | null;
  previewImage: string | null;
};

export type CreateUrlInput = {
  url: string;
  title?: string;
  description?: string | null;
  category?: UrlCategory | null;
  tags?: string[];
  faviconUrl?: string | null;
  previewImage?: string | null;
};
