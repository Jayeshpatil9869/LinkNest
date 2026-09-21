# LinkNest Micro-Interactions Plan

**Date:** 2026-09-21  
**Goal:** Awwwards-grade feel — calm, purposeful GSAP motion. Transform/opacity only. Honor `prefers-reduced-motion`.

## Existing motion

| Piece | Status |
| --- | --- |
| Lenis + ScrollTrigger sync | Done |
| Navbar expand ↔ pill (GSAP) | Done |
| Reveal / Parallax | Done |
| Modal enter/exit (Motion) | Done |
| Card CSS hover overlay | Done |
| Hero / filters / buttons | Mostly static |

## Interaction map

### 1. Hero — Enter / submit (signature)
On Enter or “Add URL” click:
1. Bar compresses slightly (`scale 0.985`)
2. Soft gold flash pulse on the glass shell
3. Button label morphs → check for ~280ms
4. Then open Add modal with the URL
5. Optional: gentle scroll nudge toward `#library` after save (already via `focusRecord`)

Empty submit: short horizontal shake (error cue).

### 2. Hero — first paint
Stagger: eyebrow → title → subtitle → bar → footnote (`power3.out`, ~0.9s total).

### 3. Buttons
Shared press: `scale 0.96` down / spring back (`power2.out`). Primary hover: tiny y lift (keep CSS + GSAP press).

### 4. Filter chips
Select: scale 0.94 → 1.04 → 1 with color swap. Deselect: soft fade.

### 5. Cards
Desktop pointer enter: `y: -4` + slight media scale; leave reverse. Keep overlay CSS.

### 6. Library toolbar
Search focus: soft glow pulse once. Clear (X): rotate-out. Chip row inherits filter press.

### 7. Modal / save (light touch)
On successful save: toast already; card highlight ring stays. Modal close: existing Motion blur.

## Rules
- One craft system: **GSAP** for UI micro-interactions (Modal keeps Motion).
- No bounce/elastic; use `power2` / `power3` / short back(0.6) max.
- Skip all motion when `prefers-reduced-motion: reduce`.
- Prefer `will-change: transform` only during tweens.

## Ship order
1. `lib/motion/presets.ts` + `usePressable` / `Pressable`
2. Hero entrance + Enter celebration
3. Button press + filter chips
4. Card hover lift
5. Toolbar focus polish
