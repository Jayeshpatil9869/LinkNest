"use client";

import { useRef } from "react";
import gsap from "gsap";
import { Search, X } from "lucide-react";
import { URL_CATEGORIES } from "@/types/url";
import type { FilterChip } from "@/hooks/useUrlFilters";
import { cn } from "@/lib/utils";
import { MOTION, prefersReducedMotion, pressIn, pressOut } from "@/lib/motion/presets";

const CHIPS: FilterChip[] = ["All", "Recent", ...URL_CATEGORIES];

type LibraryToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  chip: FilterChip;
  onChipChange: (value: FilterChip) => void;
};

export function LibraryToolbar({
  query,
  onQueryChange,
  chip,
  onChipChange,
}: LibraryToolbarProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLLabelElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const hasQuery = query.trim().length > 0;

  const pulseFocus = () => {
    const el = searchWrapRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(
      el,
      { boxShadow: "0 0 0 0 rgba(247, 215, 151, 0)" },
      {
        boxShadow: "0 0 0 4px rgba(247, 215, 151, 0.35)",
        duration: 0.28,
        ease: MOTION.easeSoft,
        yoyo: true,
        repeat: 1,
      },
    );
  };

  const selectChip = (item: FilterChip, button: HTMLButtonElement | null) => {
    onChipChange(item);
    if (!button || prefersReducedMotion()) return;
    gsap
      .timeline()
      .to(button, { scale: 0.92, duration: 0.1, ease: MOTION.easeSoft })
      .to(button, { scale: 1.04, duration: 0.16, ease: MOTION.easeOut })
      .to(button, { scale: 1, duration: 0.2, ease: MOTION.easeOut });
  };

  const clearSearch = () => {
    const btn = shellRef.current?.querySelector("[data-clear-search]");
    if (btn && !prefersReducedMotion()) {
      gsap.fromTo(
        btn,
        { rotate: 0 },
        { rotate: 90, duration: 0.22, ease: MOTION.easeOut },
      );
    }
    onQueryChange("");
  };

  return (
    <div
      ref={shellRef}
      className="glass-panel-strong rounded-[14px] p-2.5 sm:rounded-[18px] sm:p-3.5"
    >
      <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-center lg:gap-4">
        <label
          ref={searchWrapRef}
          className="relative block min-w-0 flex-1 rounded-[12px]"
        >
          <span className="sr-only">Search library</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-stone)] sm:left-3.5"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onFocus={pulseFocus}
            placeholder="Search title, domain, or notes"
            className={cn(
              "h-10 w-full rounded-[10px] border border-transparent bg-[var(--color-cloud)]/55 pr-10 pl-9 sm:h-11 sm:rounded-[12px] sm:pl-10",
              "text-[14px] text-[var(--color-ink)] outline-none ring-0 placeholder:text-[var(--color-stone)]",
              "transition-[border-color,background-color,box-shadow] duration-[var(--duration-micro)]",
              "focus:border-[var(--border)] focus:bg-[var(--color-cloud)]/80 focus:shadow-[var(--shadow-sm)] focus:outline-none focus-visible:outline-none",
            )}
          />
          {hasQuery ? (
            <button
              type="button"
              data-clear-search
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--color-stone)] transition-colors hover:bg-[var(--color-ink)]/8 hover:text-[var(--color-ink)] sm:right-2.5"
              aria-label="Clear search"
              onClick={clearSearch}
              onPointerDown={(event) => pressIn(event.currentTarget)}
              onPointerUp={(event) => pressOut(event.currentTarget)}
              onPointerLeave={(event) => pressOut(event.currentTarget)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>

        <div
          className="hidden h-8 w-px shrink-0 bg-[var(--border)] lg:block"
          aria-hidden
        />

        <div
          className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:max-w-[58%] lg:flex-wrap lg:overflow-visible lg:px-0"
          role="tablist"
          aria-label="Filter library"
        >
          {CHIPS.map((item) => {
            const selected = chip === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                ref={(node) => {
                  if (node) chipRefs.current.set(item, node);
                  else chipRefs.current.delete(item);
                }}
                onClick={(event) => selectChip(item, event.currentTarget)}
                className={cn(
                  "min-h-8 shrink-0 rounded-full px-3 text-[12px] font-medium will-change-transform sm:min-h-9 sm:px-3.5 sm:text-[13px]",
                  "transition-[background-color,color,box-shadow] duration-[var(--duration-micro)] ease-[var(--ease-premium)]",
                  "hover:-translate-y-px",
                  selected
                    ? "bg-[var(--color-ink)] text-[var(--color-cloud)] shadow-[var(--shadow-sm)]"
                    : "bg-[var(--color-cloud)]/50 text-[var(--color-slate)] hover:bg-[var(--color-mesh-peach)]/30",
                )}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
