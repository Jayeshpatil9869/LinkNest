"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { UrlRecord } from "@/types/url";

const CACHE_KEY = "linknest_cached_urls_v1";

function getCachedUrls(): UrlRecord[] | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function setCachedUrls(urls: UrlRecord[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(urls));
  } catch {
    // Ignore storage quota
  }
}

async function fetchUrls(): Promise<UrlRecord[]> {
  const response = await fetch("/api/urls");
  if (!response.ok) {
    throw new Error("Unable to load your library.");
  }
  const data = (await response.json()) as { urls: UrlRecord[] };
  setCachedUrls(data.urls);
  return data.urls;
}

export function useUrls() {
  const queryClient = useQueryClient();

  // Seed cache from localStorage immediately after client hydration
  // This guarantees 100% zero hydration mismatch between SSR and client
  useEffect(() => {
    const cached = getCachedUrls();
    if (cached && cached.length > 0) {
      queryClient.setQueryData<UrlRecord[]>(["urls"], (current) => current ?? cached);
    }
  }, [queryClient]);

  useEffect(() => {
    const onRefresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["urls"] });
    };

    const onAdded = (e: Event) => {
      const customEvent = e as CustomEvent<UrlRecord>;
      if (customEvent.detail) {
        queryClient.setQueryData<UrlRecord[]>(["urls"], (prev) => {
          const current = prev ?? [];
          if (current.some((item) => item.id === customEvent.detail.id)) {
            return current;
          }
          const next = [customEvent.detail, ...current];
          setCachedUrls(next);
          return next;
        });
      }
      void queryClient.invalidateQueries({ queryKey: ["urls"] });
    };

    window.addEventListener("linknest:refresh-urls", onRefresh);
    window.addEventListener("linknest:url-added", onAdded);
    return () => {
      window.removeEventListener("linknest:refresh-urls", onRefresh);
      window.removeEventListener("linknest:url-added", onAdded);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
    staleTime: 15_000,
  });
}
