"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Check, Link2, Sparkles } from "lucide-react";
import { ShaderBackground } from "@/components/ui/mesh-portfolio";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MOTION, prefersReducedMotion, shakeX } from "@/lib/motion/presets";

type HeroSectionProps = {
  onAddUrl: (url: string) => void;
};

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function HeroSection({ onAddUrl }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    const focusPasteField = () => {
      const input = inputRef.current;
      if (!input || input.disabled) return;
      input.focus({ preventScroll: true });
      input.select();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const isPaste =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v";
      if (!isPaste) return;
      if (isEditableTarget(event.target) && event.target !== inputRef.current) {
        return;
      }
      // Focus before paste so Ctrl+V lands in the URL field.
      focusPasteField();
    };

    const onPaste = (event: ClipboardEvent) => {
      if (isEditableTarget(event.target) && event.target !== inputRef.current) {
        return;
      }
      const text = event.clipboardData?.getData("text")?.trim();
      if (!text) return;
      event.preventDefault();
      setUrl(text);
      focusPasteField();
    };

    const onFocusPaste = () => focusPasteField();

    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("paste", onPaste, true);
    window.addEventListener("linknest:focus-paste", onFocusPaste);

    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("paste", onPaste, true);
      window.removeEventListener("linknest:focus-paste", onFocusPaste);
    };
  }, []);

  const playSubmitMotion = (next: string) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setSending(true);

    const bar = barRef.current;
    const flash = flashRef.current;
    const reduced = prefersReducedMotion();

    const finish = () => {
      onAddUrl(next);
      setUrl("");
      setSending(false);
      busyRef.current = false;
      if (bar) gsap.set(bar, { clearProps: "scale" });
      if (flash) gsap.set(flash, { opacity: 0 });
      // Ready for the next paste after save starts.
      window.setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 120);
    };

    if (reduced || !bar) {
      finish();
      return;
    }

    gsap
      .timeline({ onComplete: finish })
      .to(bar, { scale: 0.985, duration: 0.14, ease: MOTION.easeSoft })
      .to(flash, { opacity: 1, duration: 0.18, ease: MOTION.easeSoft }, 0)
      .to(bar, { scale: 1.01, duration: 0.2, ease: MOTION.easeOut })
      .to(flash, { opacity: 0, duration: 0.3, ease: MOTION.easeSoft }, "-=0.1")
      .to(bar, { scale: 1, duration: 0.24, ease: MOTION.easeOut });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = url.trim();
    if (!next) {
      if (barRef.current) shakeX(barRef.current);
      return;
    }
    playSubmitMotion(next);
  };

  return (
    <section
      ref={rootRef}
      aria-label="LinkNest hero"
      className="relative isolate min-h-dvh w-full overflow-hidden"
    >
      {/* Instant Ambient Mesh Gradient Fallback (Zero-FOUC) */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(247, 215, 151, 0.42) 0%, rgba(247, 192, 151, 0.25) 45%, rgba(255, 247, 239, 0.95) 85%, #FFF7EF 100%)",
        }}
        aria-hidden
      />

      {/* WebGL Shader Background */}
      <ShaderBackground className="absolute inset-0 h-full w-full" />

      {/* Top and Bottom soft vignette overlays */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,250,250,0.12) 0%, transparent 40%, rgba(247,215,151,0.12) 75%, rgba(255,247,239,0.85) 100%)",
        }}
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 mx-auto flex min-h-dvh w-full max-w-[920px] flex-col items-center justify-center",
          "px-[var(--page-x)] pt-[calc(var(--nav-top)+4.5rem)] pb-10 text-center",
          "sm:px-8 sm:pt-[calc(var(--nav-top)+5rem)] sm:pb-12",
        )}
      >
        {/* Eyebrow Badge */}
        <div className="hero-anim-1 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-glass)] bg-[rgba(255,251,246,0.65)] px-3.5 py-1 backdrop-blur-md shadow-sm">
          <Sparkles className="h-3 w-3 text-[var(--color-accent)]" />
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-slate)] uppercase sm:text-[11px] sm:tracking-[0.22em]">
            Editorial Archive
          </span>
        </div>

        {/* Hero Title */}
        <h1
          className="hero-anim-2 mt-4 font-semibold tracking-tight text-[var(--color-ink)] sm:mt-5"
          style={{ fontSize: "var(--text-hero)", lineHeight: 1.05 }}
        >
          LinkNest
        </h1>

        {/* Hero Subtitle */}
        <p className="hero-anim-3 mt-3.5 max-w-[34rem] text-[15px] leading-relaxed text-[var(--color-slate)] sm:mt-4 sm:text-lg">
          Paste a URL worth remembering. Build a calm visual archive of the
          places you return to.
        </p>

        {/* Hero Search & Paste Bar with Ambient Glowing Halo */}
        <div
          ref={barRef}
          className="hero-anim-4 relative mt-7 w-full max-w-xl sm:mt-10 sm:max-w-2xl"
        >
          {/* Ambient Gold Glow Halo */}
          <div
            className="hero-glow-halo pointer-events-none absolute -inset-2 z-0 rounded-[24px] bg-gradient-to-r from-[#F7D797] via-[#F7C097] to-[#E9A56F] opacity-40 blur-xl transition-opacity duration-500"
            aria-hidden
          />

          {/* Flash feedback on save */}
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-0 z-[2] rounded-[16px] opacity-0 sm:rounded-[18px]"
            style={{
              boxShadow:
                "0 0 0 1.5px rgba(247,215,151,0.95), 0 0 45px rgba(247,192,151,0.55)",
              background: "rgba(247,215,151,0.15)",
            }}
            aria-hidden
          />

          <GlassPanel
            tone="strong"
            className="relative z-[1] rounded-[16px] p-1.5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:shadow-xl sm:rounded-[18px] sm:p-2 [&_input]:outline-none [&_input]:ring-0 [&_input:focus]:outline-none [&_input:focus-visible]:outline-none [&_input:focus-visible]:ring-0"
          >
            <form
              onSubmit={submit}
              className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
            >
              <label className="relative flex min-h-11 flex-1 items-center gap-2.5 px-3 sm:min-h-12 sm:gap-3">
                <Link2
                  className="h-4 w-4 shrink-0 text-[var(--color-stone)] transition-colors group-focus-within:text-[var(--color-ink)]"
                  aria-hidden
                />
                <span className="sr-only">Website URL</span>
                <input
                  ref={inputRef}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://paste-a-url-here.com"
                  autoComplete="url"
                  inputMode="url"
                  enterKeyHint="go"
                  autoFocus
                  disabled={sending}
                  aria-label="Paste a website URL"
                  className="w-full min-w-0 bg-transparent text-[15px] text-[var(--color-ink)] outline-none ring-0 placeholder:text-[var(--color-stone)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-70 font-sans"
                />
              </label>
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full shrink-0 rounded-[12px] shadow-sm transition-transform active:scale-[0.98] sm:w-auto sm:rounded-[14px]"
              >
                {sending ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden />
                    Ready
                  </>
                ) : (
                  <>
                    Add URL
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </>
                )}
              </Button>
            </form>
          </GlassPanel>
        </div>

        {/* Footnote */}
        <p className="hero-anim-5 mt-3.5 max-w-sm text-[11px] leading-relaxed tracking-wide text-[var(--color-stone)] sm:mt-4 sm:text-xs">
          No account needed — instant URL extraction and visual card archiving.
        </p>
      </div>
    </section>
  );
}
