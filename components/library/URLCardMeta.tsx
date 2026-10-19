"use client";

import { useState } from "react";
import type { UrlRecord } from "@/types/url";

type URLCardMetaProps = {
  record: UrlRecord;
};

/** Awwwards nominees meta row: avatar + name + optional PRO */
export function URLCardMeta({ record }: URLCardMetaProps) {
  const label = record.domain.replace(/^www\./, "");
  const [useFallback, setUseFallback] = useState(false);
  const [hideIcon, setHideIcon] = useState(false);

  // If the record's faviconUrl is broken or 404s, try Google S2 Favicon API
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${label}&sz=64`;
  const iconSrc = useFallback ? googleFavicon : (record.faviconUrl || googleFavicon);

  return (
    <div className="mt-2.5 flex min-w-0 items-center gap-2">
      {!hideIcon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc}
          alt=""
          width={20}
          height={20}
          loading="lazy"
          className="h-5 w-5 shrink-0 rounded-full object-cover"
          onError={() => {
            if (!useFallback && record.faviconUrl && !record.faviconUrl.includes("google.com")) {
              setUseFallback(true);
            } else {
              setHideIcon(true);
            }
          }}
        />
      ) : (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink)] text-[8px] font-semibold text-[var(--color-cloud)]"
          aria-hidden
        >
          {label.slice(0, 1).toUpperCase()}
        </span>
      )}
      <span className="truncate text-[13px] leading-none font-medium tracking-[-0.01em] text-[var(--color-ink)]">
        {label}
      </span>
      {record.category ? (
        <span className="shrink-0 text-[9px] font-semibold tracking-[0.08em] text-[#8a8078] uppercase">
          {record.category}
        </span>
      ) : null}
    </div>
  );
}
