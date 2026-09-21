"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis, type LenisRef } from "lenis/react";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    setReady(true);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion) return;

    document.documentElement.classList.add("lenis");
    gsap.ticker.lagSmoothing(0);

    let detach: (() => void) | undefined;
    let frame = 0;
    let tries = 0;

    const connect = () => {
      const lenis = lenisRef.current?.lenis;
      if (!lenis) {
        if (tries < 90) {
          tries += 1;
          frame = requestAnimationFrame(connect);
        }
        return;
      }

      const onScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onScroll);
      ScrollTrigger.refresh();

      detach = () => {
        lenis.off("scroll", onScroll);
      };
    };

    connect();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      detach?.();
      document.documentElement.classList.remove("lenis");
      window.removeEventListener("resize", onResize);
    };
  }, [ready, reduceMotion]);

  if (!ready || reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        // Let Lenis own its RAF — most reliable for smooth wheel scrolling.
        autoRaf: true,
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
        orientation: "vertical",
        gestureOrientation: "vertical",
      }}
    >
      {children}
    </ReactLenis>
  );
}
