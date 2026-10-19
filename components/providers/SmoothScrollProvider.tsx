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

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);
    const sync = () => setReduceMotion(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    document.documentElement.classList.add("lenis");
    // Enable GSAP lag smoothing to absorb frame spikes smoothly
    gsap.ticker.lagSmoothing(500, 33);

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

    const tick = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    connect();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      gsap.ticker.remove(tick);
      detach?.();
      document.documentElement.classList.remove("lenis");
      window.removeEventListener("resize", onResize);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.25,
        wheelMultiplier: 0.95,
        orientation: "vertical",
        gestureOrientation: "vertical",
      }}
    >
      {children}
    </ReactLenis>
  );
}
