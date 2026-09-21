"use client";

import { useMemo, useState } from "react";
import type { UrlCategory, UrlRecord } from "@/types/url";

export type FilterChip = "All" | "Recent" | UrlCategory;

export function useUrlFilters(urls: UrlRecord[] | undefined) {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<FilterChip>("All");

  const filtered = useMemo(() => {
    const list = urls ?? [];
    const q = query.trim().toLowerCase();

    let next = list;
    if (chip !== "All" && chip !== "Recent") {
      next = next.filter((item) => item.category === chip);
    }

    if (q) {
      next = next.filter((item) => {
        const haystack = [
          item.title,
          item.domain,
          item.description ?? "",
          item.url,
          ...(item.tags ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (chip === "Recent" || chip === "All") {
      next = [...next].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return next;
  }, [urls, query, chip]);

  return {
    query,
    setQuery,
    chip,
    setChip,
    filtered,
  };
}
