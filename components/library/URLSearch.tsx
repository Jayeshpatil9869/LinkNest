"use client";

import { Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";

type URLSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export function URLSearch({ value, onChange }: URLSearchProps) {
  return (
    <GlassPanel tone="strong" className="rounded-[16px] p-2">
      <label className="relative block">
        <span className="sr-only">Search library</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-stone)]"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search title, domain, or notes"
          className="border-transparent bg-transparent pl-10 shadow-none focus:border-transparent focus:bg-[var(--color-cloud)]/50"
        />
      </label>
    </GlassPanel>
  );
}
