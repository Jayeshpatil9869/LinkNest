"use client";

import { useEffect, useState } from "react";
import type { UrlRecord } from "@/types/url";
import { resolvePreviewImage } from "@/lib/url/preview-image";
import { URLCardFallback } from "@/components/library/URLCardFallback";
import { cn } from "@/lib/utils";

type URLCardMediaProps = {
  record: UrlRecord;
  className?: string;
};

/** Awwwards-style landscape preview (~3:2), soft 6px radius */
export function URLCardMedia({ record, className }: URLCardMediaProps) {
  const src = resolvePreviewImage(record.url, record.previewImage);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  return (
    <div
      className={cn(
        "relative aspect-[3/2] overflow-hidden rounded-[6px] bg-[#ececec]",
        className,
      )}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Preview of ${record.title}`}
          className={cn(
            "h-full w-full object-cover object-top transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]",
            loaded ? "opacity-100" : "opacity-0",
          )}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}

      {!loaded && !failed ? (
        <div className="absolute inset-0 animate-pulse bg-[#e8e8e8]" />
      ) : null}

      {failed ? <URLCardFallback record={record} /> : null}
    </div>
  );
}
