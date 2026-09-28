"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { UrlRecord } from "@/types/url";
import { resolvePreviewImage } from "@/lib/url/preview-image";
import { URLCardFallback } from "@/components/library/URLCardFallback";
import { prefersReducedMotion } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

let refreshTimer = 0;

function refreshAfterImage() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120);
}

type URLCardMediaProps = {
  record: UrlRecord;
  className?: string;
};

/** Awwwards-style landscape preview (~3:2), soft 10px radius */
export function URLCardMedia({ record, className }: URLCardMediaProps) {
  const src = resolvePreviewImage(record.url, record.previewImage);
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  useGSAP(
    () => {
      const frame = frameRef.current;
      const layer = layerRef.current;
      if (!frame || !layer || prefersReducedMotion() || failed) return;

      gsap.fromTo(
        layer,
        { y: 0 },
        {
          y: () => frame.offsetHeight - layer.offsetHeight,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: frameRef, dependencies: [src, failed], revertOnUpdate: true },
  );

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative aspect-[3/2] overflow-hidden rounded-[10px] bg-[rgba(236,217,195,0.35)] border border-[var(--border)]",
        className,
      )}
    >
      {!failed ? (
        <div ref={layerRef} className="absolute inset-x-0 top-0 h-[124%] w-full will-change-transform">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Preview of ${record.title}`}
            className={cn(
              "h-full w-full object-cover object-top transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]",
              loaded ? "opacity-100" : "opacity-0",
            )}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              setLoaded(true);
              refreshAfterImage();
            }}
            onError={() => setFailed(true)}
          />
        </div>
      ) : null}

      {!loaded && !failed ? (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,251,246,0.5)] to-transparent animate-pulse" />
      ) : null}

      {failed ? <URLCardFallback record={record} /> : null}
    </div>
  );
}
