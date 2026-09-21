"use client";

import { useQuery } from "@tanstack/react-query";
import type { UrlRecord } from "@/types/url";

async function fetchUrls(): Promise<UrlRecord[]> {
  const response = await fetch("/api/urls");
  if (!response.ok) {
    throw new Error("Unable to load your library.");
  }
  const data = (await response.json()) as { urls: UrlRecord[] };
  return data.urls;
}

export function useUrls() {
  return useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
  });
}
