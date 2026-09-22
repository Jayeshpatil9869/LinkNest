"use client";

import { useEffect, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Plus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePWAContext } from "@/components/pwa/PWAProvider";

type NavbarProps = {
  onAdd: () => void;
};

/**
 * CSS-driven navbar with PWA installation support.
 */
export function Navbar({ onAdd }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const { canInstall, isStandalone, promptInstall } = usePWAContext();

  useEffect(() => {
    const sync = () => {
      const next = window.scrollY > 48;
      setCompact((prev) => (prev === next ? prev : next));
      if (next) setMenuOpen(false);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        compact
          ? "px-4 pt-2.5 sm:px-6 sm:pt-3"
          : "px-[var(--page-x)] pt-[var(--nav-top)]",
      )}
    >
      <div
        className={cn(
          "glass-navbar pointer-events-auto mx-auto flex h-12 w-full items-center justify-between gap-2 sm:h-[3.25rem]",
          "transition-[max-width,border-radius,padding,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          compact
            ? "is-scrolled max-w-[min(100%,22rem)] rounded-full px-3.5 sm:max-w-[28rem] sm:px-4"
            : "max-w-[min(100%,1680px)] rounded-[16px] px-3 sm:rounded-[18px] sm:px-4",
        )}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span
            className={cn(
              "shrink-0 font-semibold tracking-tight text-[var(--color-ink)] transition-[font-size] duration-300",
              compact ? "text-[14px] sm:text-[15px]" : "text-base sm:text-lg",
            )}
          >
            LinkNest
          </span>
          <span
            className={cn(
              "hidden overflow-hidden whitespace-nowrap text-sm text-[var(--color-stone)] transition-[opacity,max-width] duration-300 md:inline",
              compact ? "max-w-0 opacity-0" : "max-w-[10rem] opacity-100",
            )}
          >
            Visual archive
          </span>
        </div>

        <nav
          className="hidden items-center gap-1 sm:gap-1.5 md:flex"
          aria-label="Primary"
        >
          <a
            href="#library"
            className={cn(
              "rounded-full px-2.5 text-sm text-[var(--color-slate)] transition-colors hover:text-[var(--color-ink)] sm:px-3",
              compact ? "py-1.5" : "py-2",
            )}
          >
            Library
          </a>

          {canInstall && !isStandalone && (
            <Button
              variant="soft"
              size="sm"
              className={cn(
                "rounded-full gap-1.5 text-xs text-[var(--color-ink)]",
                compact && "min-h-9 px-2.5",
              )}
              onClick={() => void promptInstall()}
              aria-label="Install LinkNest app"
            >
              <Download className="h-3.5 w-3.5" />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300",
                  compact ? "max-w-0 opacity-0" : "max-w-[6rem] opacity-100",
                )}
              >
                Install App
              </span>
            </Button>
          )}

          <Button
            onClick={onAdd}
            size="sm"
            className={cn("rounded-full", compact && "min-h-9 px-3")}
            aria-label="Add URL"
          >
            <Plus className="h-4 w-4" />
            <span
              className={cn(
                "overflow-hidden whitespace-nowrap transition-[opacity,max-width] duration-300",
                compact ? "max-w-0 opacity-0" : "max-w-[5rem] opacity-100",
              )}
            >
              Add URL
            </span>
          </Button>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
          {canInstall && !isStandalone && (
            <Button
              variant="soft"
              size="sm"
              className="min-h-9 w-9 rounded-full px-0"
              onClick={() => void promptInstall()}
              aria-label="Install App"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={onAdd}
            size="sm"
            className="min-h-9 w-9 rounded-full px-0"
            aria-label="Add URL"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {!compact ? (
            <Button
              variant="soft"
              size="sm"
              className="rounded-full"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((value) => !value)}
            >
              Menu
            </Button>
          ) : null}
        </div>
      </div>

      {menuOpen && !compact ? (
        <GlassPanel
          id="mobile-nav"
          tone="strong"
          className="pointer-events-auto mx-auto mt-2 w-full max-w-full space-y-1 rounded-[16px] p-2 md:hidden"
        >
          <a
            href="#library"
            className="block rounded-[12px] px-3 py-3 text-sm text-[var(--color-slate)] hover:bg-[rgba(63,52,44,0.06)]"
            onClick={() => setMenuOpen(false)}
          >
            Library
          </a>
          {canInstall && !isStandalone && (
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-[12px] px-3 py-3 text-left text-sm font-medium text-[var(--color-ink)] hover:bg-[rgba(63,52,44,0.06)]"
              onClick={() => {
                setMenuOpen(false);
                void promptInstall();
              }}
            >
              <Download className="h-4 w-4" />
              <span>Install LinkNest App</span>
            </button>
          )}
        </GlassPanel>
      ) : null}
    </header>
  );
}
