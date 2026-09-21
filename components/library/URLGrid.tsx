"use client";

import type { UrlRecord } from "@/types/url";
import { URLCard } from "@/components/library/URLCard";
import { Reveal } from "@/components/motion/Reveal";

type URLGridProps = {
  urls: UrlRecord[];
  highlightId?: string | null;
  onDeleted: (id: string) => void;
};

/** Awwwards nominees grid: 3 columns, generous gutters */
export function URLGrid({ urls, highlightId, onDeleted }: URLGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 sm:gap-x-7 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
      {urls.map((record, index) => (
        <Reveal key={record.id} delay={Math.min(index * 0.03, 0.18)}>
          <URLCard
            record={record}
            highlight={highlightId === record.id}
            promoted={index === 3}
            onDeleted={onDeleted}
          />
        </Reveal>
      ))}
    </div>
  );
}
