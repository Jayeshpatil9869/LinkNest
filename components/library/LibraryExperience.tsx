"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Navbar } from "@/components/navigation/Navbar";
import { HeroSection } from "@/components/library/HeroSection";
import { LibraryToolbar } from "@/components/library/LibraryToolbar";
import { URLGrid } from "@/components/library/URLGrid";
import { LoadingGrid } from "@/components/library/LoadingGrid";
import { EmptyLibrary } from "@/components/library/EmptyLibrary";
import { AddURL } from "@/components/library/AddURL";
import { useUrls } from "@/hooks/useUrls";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Reveal } from "@/components/motion/Reveal";
import type { UrlRecord } from "@/types/url";

export function LibraryExperience() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useUrls();
  const { query, setQuery, chip, setChip, filtered } = useUrlFilters(data);
  const [addOpen, setAddOpen] = useState(false);
  const [initialUrl, setInitialUrl] = useState("");
  const [autoSubmit, setAutoSubmit] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const openAdd = (url = "", submitImmediately = false) => {
    setInitialUrl(url);
    setAutoSubmit(submitImmediately);
    setAddOpen(true);
  };

  const closeAdd = () => {
    setAddOpen(false);
    setInitialUrl("");
    setAutoSubmit(false);
    window.setTimeout(() => {
      window.dispatchEvent(new Event("linknest:focus-paste"));
    }, 80);
  };

  const onDeleted = (id: string) => {
    queryClient.setQueryData<UrlRecord[]>(["urls"], (current) =>
      (current ?? []).filter((item) => item.id !== id),
    );
    void queryClient.invalidateQueries({ queryKey: ["urls"] });
  };

  const focusRecord = (record: UrlRecord) => {
    setHighlightId(record.id);
    window.requestAnimationFrame(() => {
      document.getElementById(`url-${record.id}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    window.setTimeout(() => setHighlightId(null), 2400);
  };

  const hasFilters = Boolean(query.trim()) || chip !== "All";

  return (
    <>
      <Navbar onAdd={() => openAdd()} />
      <HeroSection onAddUrl={(url) => openAdd(url, true)} />

      <main
        id="library"
        className="page-shell flex-1 pt-8 pb-14 sm:pt-10 sm:pb-16 lg:pb-20"
      >
        <Reveal className="space-y-4 sm:space-y-5">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
            <div>
              <p className="text-[11px] font-medium tracking-[0.14em] text-[var(--color-stone)] uppercase sm:text-sm">
                Library
              </p>
              <h2
                className="mt-1 font-semibold tracking-tight text-[var(--color-ink)]"
                style={{ fontSize: "var(--text-section)" }}
              >
                Saved links
              </h2>
            </div>
            {!isLoading && !isError && data ? (
              <p className="text-xs text-[var(--color-stone)] sm:text-sm">
                {data.length} saved
              </p>
            ) : null}
          </div>
          <LibraryToolbar
            query={query}
            onQueryChange={setQuery}
            chip={chip}
            onChipChange={setChip}
          />
        </Reveal>

        <section className="mt-6 sm:mt-8" aria-label="Saved URLs">
          {isLoading ? <LoadingGrid /> : null}

          {isError ? (
            <div className="glass-panel-soft rounded-[16px] px-5 py-8 text-center">
              <p className="text-[var(--color-slate)]">
                The library could not be loaded right now.
              </p>
              <button
                type="button"
                className="mt-3 text-sm font-medium text-[var(--color-ink)] underline-offset-4 hover:underline"
                onClick={() => void refetch()}
              >
                Try again
              </button>
            </div>
          ) : null}

          {!isLoading && !isError && filtered.length === 0 ? (
            <EmptyLibrary onAdd={() => openAdd()} hasFilters={hasFilters} />
          ) : null}

          {!isLoading && !isError && filtered.length > 0 ? (
            <URLGrid
              urls={filtered}
              highlightId={highlightId}
              onDeleted={onDeleted}
            />
          ) : null}
        </section>
      </main>

      <footer className="page-shell pb-8 text-center text-xs text-[var(--color-stone)] sm:pb-10 sm:text-sm">
        LinkNest · a visual URL archive
      </footer>

      <AddURL
        open={addOpen}
        initialUrl={initialUrl}
        autoSubmit={autoSubmit}
        onClose={closeAdd}
        onSaved={focusRecord}
        onDuplicate={focusRecord}
      />
    </>
  );
}
