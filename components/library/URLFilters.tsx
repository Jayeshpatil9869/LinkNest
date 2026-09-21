"use client";

import { URL_CATEGORIES } from "@/types/url";
import type { FilterChip } from "@/hooks/useUrlFilters";
import { cn } from "@/lib/utils";

const CHIPS: FilterChip[] = ["All", "Recent", ...URL_CATEGORIES];

type URLFiltersProps = {
  value: FilterChip;
  onChange: (value: FilterChip) => void;
};

export function URLFilters({ value, onChange }: URLFiltersProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Filter library"
    >
      {CHIPS.map((chip) => {
        const selected = value === chip;
        return (
          <button
            key={chip}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(chip)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-4 text-sm transition-[transform,background-color,box-shadow,border-color,color] duration-[var(--duration-micro)] ease-[var(--ease-premium)]",
              "hover:-translate-y-px",
              selected
                ? "border-transparent bg-[var(--color-ink)] text-[var(--color-cloud)] shadow-[var(--shadow-sm)]"
                : "glass-chip text-[var(--color-slate)] hover:border-[var(--color-accent)]/45 hover:bg-[var(--color-mesh-peach)]/25 hover:shadow-[var(--shadow-sm)]",
            )}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
