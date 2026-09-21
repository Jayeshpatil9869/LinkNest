import gsap from "gsap";

/** Shared LinkNest motion tokens — transform/opacity only */
export const MOTION = {
  easeOut: "power3.out",
  easeSoft: "power2.out",
  easeInOut: "power2.inOut",
  micro: 0.18,
  press: 0.22,
  component: 0.38,
  section: 0.65,
  page: 0.85,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function pressIn(target: gsap.TweenTarget) {
  if (prefersReducedMotion()) return;
  gsap.to(target, {
    scale: 0.96,
    duration: MOTION.press,
    ease: MOTION.easeSoft,
    overwrite: "auto",
  });
}

export function pressOut(target: gsap.TweenTarget) {
  if (prefersReducedMotion()) return;
  gsap.to(target, {
    scale: 1,
    duration: MOTION.component,
    ease: MOTION.easeOut,
    overwrite: "auto",
  });
}

export function shakeX(target: gsap.TweenTarget) {
  if (prefersReducedMotion()) return;
  gsap
    .timeline({ defaults: { ease: MOTION.easeSoft } })
    .to(target, { x: -8, duration: 0.06 })
    .to(target, { x: 8, duration: 0.08 })
    .to(target, { x: -6, duration: 0.08 })
    .to(target, { x: 4, duration: 0.08 })
    .to(target, { x: 0, duration: 0.12 });
}
