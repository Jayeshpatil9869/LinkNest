"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { ShaderBackground } from "@/components/ui/mesh-portfolio";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MOTION, prefersReducedMotion, shakeX } from "@/lib/motion/presets";

gsap.registerPlugin(useGSAP);

type HeroSectionProps = {
  onAddUrl: (url: string) => void;
};

export function HeroSection({ onAddUrl }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const footnoteRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(
          [
            eyebrowRef.current,
            titleRef.current,
            subtitleRef.current,
            barRef.current,
            footnoteRef.current,
          ],
          { clearProps: "all", opacity: 1, y: 0 },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: MOTION.easeOut } });
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 },
      )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.65 },
          "-=0.3",
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.35",
        )
        .fromTo(
          barRef.current,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          footnoteRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.3",
        );
    },
    { scope: rootRef },
  );

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
      <ShaderBackground className="absolute inset-0 h-full w-full" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(250,250,250,0.14) 0%, transparent 42%, rgba(247,215,151,0.14) 78%, rgba(255,247,239,0.72) 100%)",
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
        <p
          ref={eyebrowRef}
          className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-stone)] uppercase sm:text-[11px] sm:tracking-[0.22em]"
          style={{ opacity: 0 }}
        >
          Your collection
        </p>
        <h1
          ref={titleRef}
          className="mt-3 font-semibold tracking-tight text-[var(--color-ink)] sm:mt-4"
          style={{ opacity: 0, fontSize: "var(--text-hero)", lineHeight: 1.05 }}
        >
          LinkNest
        </h1>
        <p
          ref={subtitleRef}
          className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-[var(--color-slate)] sm:mt-4 sm:text-lg"
          style={{ opacity: 0 }}
        >
          Paste a URL worth remembering. Build a calm visual archive of the
          places you return to.
        </p>

        <div
          ref={barRef}
          className="relative mt-7 w-full max-w-xl sm:mt-10 sm:max-w-2xl"
          style={{ opacity: 0 }}
        >
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-0 z-[1] rounded-[16px] opacity-0 sm:rounded-[18px]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(247,215,151,0.85), 0 0 40px rgba(247,192,151,0.45)",
              background: "rgba(247,215,151,0.12)",
            }}
            aria-hidden
          />
          <GlassPanel
            tone="strong"
            className="relative rounded-[16px] p-1.5 outline-none focus-within:outline-none sm:rounded-[18px] sm:p-2 [&_input]:outline-none [&_input]:ring-0 [&_input:focus]:outline-none [&_input:focus-visible]:outline-none [&_input:focus-visible]:ring-0"
          >
            <form
              onSubmit={submit}
              className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
            >
              <label className="relative flex min-h-11 flex-1 items-center gap-2.5 px-3 sm:min-h-12 sm:gap-3">
                <Link2
                  className="h-4 w-4 shrink-0 text-[var(--color-stone)]"
                  aria-hidden
                />
                <span className="sr-only">Website URL</span>
                <input
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://paste-a-url-here.com"
                  autoComplete="url"
                  inputMode="url"
                  disabled={sending}
                  className="w-full min-w-0 bg-transparent text-[15px] text-[var(--color-ink)] outline-none ring-0 placeholder:text-[var(--color-stone)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:opacity-70"
                />
              </label>
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full shrink-0 rounded-[12px] sm:w-auto sm:rounded-[14px]"
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

        <p
          ref={footnoteRef}
          className="mt-3 max-w-sm text-[11px] leading-relaxed tracking-wide text-[var(--color-stone)] sm:mt-4 sm:text-xs"
          style={{ opacity: 0 }}
        >
          No account needed — save, search, and browse your visual library.
        </p>
      </div>
    </section>
  );
}
