"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type TiltState = {
  rotateX: number;
  rotateY: number;
  glareX: number;
  glareY: number;
};

const INITIAL: TiltState = {
  rotateX: 0,
  rotateY: 0,
  glareX: 50,
  glareY: 50,
};

export function useCardTilt(enabled = true) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [tilt, setTilt] = useState<TiltState>(INITIAL);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const bindRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  const active = enabled && finePointer && !reduced;

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!active || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setTilt({
        rotateY: Math.max(-3, Math.min(3, (x - 0.5) * 6)),
        rotateX: Math.max(-3, Math.min(3, (0.5 - y) * 6)),
        glareX: x * 100,
        glareY: y * 100,
      });
    },
    [active],
  );

  const onPointerLeave = useCallback(() => {
    setTilt(INITIAL);
  }, []);

  return {
    ref: bindRef,
    style: active
      ? {
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          ["--glare-x" as string]: `${tilt.glareX}%`,
          ["--glare-y" as string]: `${tilt.glareY}%`,
        }
      : undefined,
    onPointerMove: active ? onPointerMove : undefined,
    onPointerLeave: active ? onPointerLeave : undefined,
    active,
  };
}
