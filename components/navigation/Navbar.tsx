"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type NavbarProps = {
  onAdd: () => void;
};

function expandedMaxWidth() {
  return Math.min(window.innerWidth - 32, 1680);
}

function compactMaxWidth() {
  return Math.min(window.innerWidth - 32, window.innerWidth < 640 ? 320 : 420);
}

export function Navbar({ onAdd }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLSpanElement>(null);
  const addLabelRef = useRef<HTMLSpanElement>(null);
  const compactRef = useRef(false);
  const tweenRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const bar = barRef.current;
      const header = headerRef.current;
      const tagline = taglineRef.current;
      const addLabel = addLabelRef.current;
      if (!bar || !header) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const applyExpanded = (animate: boolean) => {
        const maxWidth = expandedMaxWidth();
        const paddingTop = window.innerWidth < 640 ? 10 : 12;
        const headerPad = window.innerWidth < 640 ? 12 : 20;

        if (!animate || reduceMotion) {
          gsap.set(bar, {
            maxWidth,
            borderRadius: window.innerWidth < 640 ? 16 : 18,
            paddingTop,
            paddingBottom: paddingTop,
            paddingLeft: window.innerWidth < 640 ? 12 : 16,
            paddingRight: window.innerWidth < 640 ? 12 : 16,
          });
          gsap.set(header, { paddingTop: headerPad });
          if (tagline) gsap.set(tagline, { autoAlpha: 1, maxWidth: 160 });
          if (addLabel) gsap.set(addLabel, { autoAlpha: 1, maxWidth: 80 });
          return;
        }

        tweenRef.current = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(header, { paddingTop: headerPad, duration: 0.5 }, 0)
          .to(
            bar,
            {
              maxWidth,
              borderRadius: 18,
              paddingTop: 12,
              paddingBottom: 12,
              paddingLeft: 16,
              paddingRight: 16,
              duration: 0.55,
            },
            0,
          )
          .to(tagline, { autoAlpha: 1, maxWidth: 160, duration: 0.3 }, 0.1)
          .to(addLabel, { autoAlpha: 1, maxWidth: 80, duration: 0.28 }, 0.12);
      };

      const applyCompact = (animate: boolean) => {
        const maxWidth = compactMaxWidth();

        if (!animate || reduceMotion) {
          gsap.set(bar, {
            maxWidth,
            borderRadius: 999,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 12,
            paddingRight: 12,
          });
          gsap.set(header, { paddingTop: window.innerWidth < 640 ? 10 : 12 });
          if (tagline) gsap.set(tagline, { autoAlpha: 0, maxWidth: 0 });
          if (addLabel) gsap.set(addLabel, { autoAlpha: 0, maxWidth: 0 });
          return;
        }

        tweenRef.current = gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(header, { paddingTop: 12, duration: 0.5 }, 0)
          .to(
            bar,
            {
              maxWidth,
              borderRadius: 999,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 14,
              paddingRight: 14,
              duration: 0.55,
            },
            0,
          )
          .to(
            tagline,
            { autoAlpha: 0, maxWidth: 0, marginLeft: 0, duration: 0.22 },
            0,
          )
          .to(addLabel, { autoAlpha: 0, maxWidth: 0, duration: 0.2 }, 0);
      };

      gsap.set(bar, {
        maxWidth: expandedMaxWidth(),
        borderRadius: window.innerWidth < 640 ? 16 : 18,
        paddingTop: window.innerWidth < 640 ? 10 : 12,
        paddingBottom: window.innerWidth < 640 ? 10 : 12,
        paddingLeft: window.innerWidth < 640 ? 12 : 16,
        paddingRight: window.innerWidth < 640 ? 12 : 16,
      });
      gsap.set(header, {
        paddingTop: window.innerWidth < 640 ? 12 : 20,
      });
      if (tagline) gsap.set(tagline, { autoAlpha: 1, maxWidth: 160 });
      if (addLabel) gsap.set(addLabel, { autoAlpha: 1, maxWidth: 80 });

      const toCompact = () => {
        if (compactRef.current) return;
        compactRef.current = true;
        setCompact(true);
        setMenuOpen(false);
        tweenRef.current?.kill();
        applyCompact(true);
      };

      const toExpanded = () => {
        if (!compactRef.current) return;
        compactRef.current = false;
        setCompact(false);
        tweenRef.current?.kill();
        applyExpanded(true);
      };

      const onScroll = () => {
        if (window.scrollY > 48) toCompact();
        else toExpanded();
      };

      const onResize = () => {
        tweenRef.current?.kill();
        if (compactRef.current) applyCompact(false);
        else applyExpanded(false);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        tweenRef.current?.kill();
      };
    },
    { scope: headerRef },
  );

  useEffect(() => {
    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40",
        "px-[var(--page-x)]",
      )}
      style={{ paddingTop: "var(--nav-top)" }}
    >
      <div
        ref={barRef}
        className={cn(
          "glass-navbar pointer-events-auto mx-auto flex w-full max-w-full items-center justify-between gap-2",
          compact && "is-scrolled",
        )}
        style={{ maxWidth: 1680, borderRadius: 18 }}
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
            ref={taglineRef}
            className="hidden overflow-hidden whitespace-nowrap text-sm text-[var(--color-stone)] md:inline"
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
          <Button
            onClick={onAdd}
            size="sm"
            className={cn("rounded-full", compact && "min-h-9 px-3")}
            aria-label="Add URL"
          >
            <Plus className="h-4 w-4" />
            <span
              ref={addLabelRef}
              className="overflow-hidden whitespace-nowrap"
            >
              Add URL
            </span>
          </Button>
        </nav>

        <div className="flex items-center gap-1.5 md:hidden">
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
          className="pointer-events-auto mx-auto mt-2 w-full max-w-full rounded-[16px] p-2 md:hidden"
        >
          <a
            href="#library"
            className="block rounded-[12px] px-3 py-3 text-sm text-[var(--color-slate)]"
            onClick={() => setMenuOpen(false)}
          >
            Library
          </a>
        </GlassPanel>
      ) : null}
    </header>
  );
}
