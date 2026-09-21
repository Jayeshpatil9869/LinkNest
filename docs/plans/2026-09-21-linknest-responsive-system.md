# LinkNest Responsive System

**Date:** 2026-09-21  
**Goal:** Fluid, glitch-free layout from 320px → 2xl desktop. Soften heavy effects on small screens.

## Breakpoints (Tailwind default)

| Token | Width | Role |
| --- | --- | --- |
| base | 0–639 | Phone |
| sm | 640+ | Large phone / small tablet |
| md | 768+ | Tablet |
| lg | 1024+ | Laptop |
| xl | 1280+ | Desktop |
| 2xl | 1536+ | Wide |

## Type scale (fluid)

| Role | Mobile | Desktop |
| --- | --- | --- |
| Eyebrow | 10–11px | 11px |
| Hero title | clamp(2.25rem, 8vw, 4.5rem) | ~72px |
| Hero body | 15–16px | 18px |
| Section H2 | 22–24px | 28px |
| Body / UI | 14–15px | 15–16px |
| Meta / chips | 12–13px | 13px |

## Space / shell

| Token | Mobile | sm+ | lg+ |
| --- | --- | --- | --- |
| `--page-x` | 16px | 24–32px | 40–48px |
| `--page-max` | 100% | — | 1680px |
| Hero content max | 100% | 720px | 920px |
| Grid | 1 col | 2 col | 3 col |
| Grid gap | 20×32 | 28×40 | 32×48 |

## Surface rules

1. **Navbar:** Full-bleed glass on phone; pill compact max ~min(92vw, 360px). Safe-area top padding.
2. **Hero:** `min-h-dvh` with safe bottom; title never overflows; URL bar stacks on &lt;sm.
3. **Library toolbar:** Search full width; chips scroll-x with fade, no wrap overflow glitches.
4. **Cards:** Touch uses native buttons (no hover GSAP lift &lt;md).
5. **Modal:** Centered, max-h 85dvh, width min(100%−32px, 420px).

## Perf (anti-lag)

- Mobile: glass blur ≤24px; navbar blur ≤40px.
- Touch: skip card y-lift GSAP.
- Prefer `dvh` / `svh`; avoid nested backdrop-filters where possible.
- Shader already DPR-capped; keep IntersectionObserver pause.
- `prefers-reduced-motion` / `prefers-reduced-transparency` honored.
