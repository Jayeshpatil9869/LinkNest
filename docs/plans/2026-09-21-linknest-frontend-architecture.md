---
title: "LinkNest Frontend Architecture - Plan"
type: feat
date: 2026-09-21
origin: LinkNest_Master_Design_Build_Prompt.md
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: legacy-requirements
execution: code
---

# LinkNest Frontend Architecture - Plan

> **For agentic workers:** Prefer `superpowers:subagent-driven-development` or `ce-work` / `superpowers:executing-plans` to execute unit-by-unit. Track progress with checkbox steps inside each unit. Authority for product behavior is `LinkNest_Master_Design_Build_Prompt.md`.

## Goal Capsule

**Objective:** Build LinkNest as a greenfield Next.js App Router frontend: a premium visual URL library with editorial cards, warm monochrome design tokens, selective glassmorphism, intentional Motion, subtle 3D tilt, Supabase persistence, smart URL metadata preview, search/filter, and zero authentication UI.

**Authority hierarchy:**
1. `LinkNest_Master_Design_Build_Prompt.md` (product + visual + acceptance source of truth)
2. This plan (sequencing, KTDs, file map, verification)
3. Package versions locked at scaffold time in `package.json`

**Stop conditions:**
- Any work that adds Login/Signup/auth middleware/protected routes
- Any work that turns the app into a SaaS dashboard, marketing landing, or purple/AI-template look
- Any new backend stack outside Supabase + Next.js Route Handlers

**Execution profile:** Greenfield scaffold → design system → data layer → library shell → card system → add/preview/CRUD → motion/depth → responsive/a11y/perf → visual QA.

**Tail ownership:** Implementer owns env setup (Supabase keys, font files). Visual QA against the master prompt §62–§67 is required before declaring done.

---

## Product Contract

### Summary

LinkNest is a personal visual URL archive. Opening the site lands directly in the library. Users browse editorial preview cards, search and filter, paste a URL into a glass Add panel, review auto-extracted metadata, save, open, or delete links. No accounts. The shell stays warm monochrome; color enters only through preview imagery.

### Problem Frame

Bookmark managers feel utilitarian and list-heavy. LinkNest must feel like a curated editorial directory: visual-first cards, calm typography (Chillax), restrained glass, tactile depth, and motion that explains state changes — without inventing enterprise features or auth.

### Requirements

#### Product core

- R1. The app opens directly into the URL library with no auth, login, signup, profile, or protected routes.
- R2. Users can create, read, search, filter, open, and delete saved URLs.
- R3. Pasting a URL validates, normalizes, checks duplicates, fetches metadata when possible, shows a preview, then saves on confirm.
- R4. Duplicate saves surface a calm “already in your library” experience with view-existing and cancel — never a generic red form error as the primary message.
- R5. URL cards are the primary UI: dominant preview media, domain, title, short description, open action; soft radius (~14–18px); editorial metadata.
- R6. Desktop uses a 3-column editorial grid; tablet 2-column; mobile 1-column. No hover-only functionality on touch.
- R7. Search filters the visible library client-side against title, domain, description, and URL.
- R8. Compact editorial filters support at least: All, Recent, plus category chips (Design, Development, Inspiration, Tools, Articles, Resources).
- R9. Empty, loading, and error states are designed and calm (not generic placeholder chrome).
- R10. Delete uses a confirmation path with fade/shrink removal feedback and Sonner toast.

#### Design system

- R11. Chillax is the sole typeface across nav, headings, body, and UI chrome; self-hosted from Fontshare assets under `public/fonts/`.
- R12. Warm monochrome palette tokens (Cloud, Fog, Stone, Slate, Ink) are centralized CSS variables; shell accents only come from content imagery.
- R13. Glassmorphism is secondary: nav, search, filters, add panel, modals, selected utility controls — not the whole app.
- R14. Spacing, radius, shadows, glass, motion, breakpoints, and z-index are tokenized; no random per-component values.

#### Motion and depth

- R15. Unified motion tokens: micro 150–250ms, component 300–500ms, section 500–800ms, page 600–1000ms; premium easing; no bounce/elastic defaults.
- R16. Card hover: image scale ~1.025–1.04, card translateY ~-4px, shadow/border deepen; duration 400–700ms.
- R17. Pointer 3D tilt max ±3° on X/Y, perspective 1000–1400px, pointer highlight; disabled on touch and when `prefers-reduced-motion: reduce`.
- R18. Entrance, scroll reveal, subtle parallax, micro-interactions, and modal open/close share one motion language; reduced-motion falls back to opacity/instant.
- R19. Magnetic/cursor-follow effects are optional polish on desktop only and must never block accessibility.

#### Accessibility, performance, responsive

- R20. Semantic HTML, keyboard nav, visible focus, dialog focus trap + Escape, ~44px touch targets, accessible labels, acceptable contrast.
- R21. Prefer `transform`/`opacity` animation; use `next/image`, lazy loading, font subsetting/display strategy, and avoid layout-thrashing animation.
- R22. Visual QA at 1920, 1440, 1024, 768, 390, 360 with intentional mobile motion (no tilt/magnetic/heavy parallax).

#### Explicit non-goals

- R23. No Express/Django/Firebase/Redux/GraphQL/Prisma/separate Node backend unless a genuine requirement appears later.
- R24. Do not clone the reference website’s branding, copy, or proprietary chrome; reinterpret principles only.

### Actors

- A1. Library visitor — sole actor in v1; uses the shared personal library without identity.

### Flows

- F1. Open → browse visual library → search/filter → open card URL.
- F2. Add → paste URL → analyze → preview → save → card enters grid.
- F3. Duplicate detect → calm message → view existing or cancel.
- F4. Delete → confirm → remove with motion → toast.

### Acceptance Examples

- AE1. When the user visits `/`, they see the library shell (nav + intro + search + filters + grid) with zero auth chrome.
- AE2. When the user pastes `https://Example.com/Path/?utm=1` and an equivalent normalized URL exists, the UI shows the existing card path instead of inserting a second row.
- AE3. When metadata fetch fails, the preview still renders a sophisticated fallback (favicon/domain/title/neutral geometric composition) with no broken-image icon.
- AE4. When `prefers-reduced-motion: reduce` is set, cards do not tilt and entrances do not use large travel; focus and function remain intact.
- AE5. When viewport is ~390px wide, grid is one column, tilt is off, and primary actions remain tappable without hover.

### Success Criteria

Matches master prompt §67 checklists: product CRUD + no auth; stack implemented; Chillax + warm tokens + editorial cards + grid breakpoints; motion + reduced motion; a11y; performance; visual QA pass.

### Scope Boundaries

**In scope:** Single-page library experience at `/`, optional `/library` redirect, Supabase `urls` table, metadata Route Handler, design tokens, card system, add modal, motion/depth, responsive/a11y/perf/QA.

**Out of scope:** Auth, multi-user RLS by user_id, marketing landing, folders/collections, social sharing, browser extension, offline-first sync, React Three Fiber hero scenes (deferred unless a single ambient scene proves necessary and cheap).

### Dependencies

- Fontshare Chillax font files (licensed for self-hosting per Fontshare terms)
- Supabase project (Postgres + API)
- Next.js Image remote patterns for preview hosts discovered at runtime (configure broad allowlist carefully)

### Outstanding Questions

- Q1. (deferred, non-blocking) Production hosting target (Vercel assumed). Confirm at deploy time.
- Q2. (deferred, non-blocking) Whether category is free-text or enum-constrained. Plan assumes enum + optional tags array for v1 filters.
- Q3. (deferred, non-blocking) R3F ambient scene. Default: CSS/Motion depth only; revisit only if visual QA demands it.

### Sources

- `LinkNest_Master_Design_Build_Prompt.md` §§01–67 (full product/visual/acceptance contract)
- Stack constraints: §11; structure: §10; DB: §12; implementation order: §64

---

## Planning Contract

### Key Technical Decisions

- KTD1. Greenfield Next.js App Router + React + TypeScript + Tailwind CSS v4 (or v3 if scaffold pins v3 — honor `create-next-app` defaults, then map tokens into CSS variables). App lives at `app/page.tsx` as the library; `app/library/page.tsx` redirects to `/`.
- KTD2. No authentication anywhere. Data layer stays future-ready: optional nullable `user_id` column is **not** added in v1 unless needed for migrations; uniqueness is `UNIQUE(normalized_url)`. Document the future `UNIQUE(user_id, normalized_url)` migration in SQL comments only.
- KTD3. **(session-settled: user-directed — chosen over live Supabase now: user will wire the database later.)** v1 ships with an in-memory / file-backed mock data layer behind the same Route Handler contracts (`GET/POST/DELETE /api/urls`, `POST /api/urls/preview`). No Supabase client, migrations, schema, RLS, or env DB keys in this pass. Swap the repository implementation to Supabase later without changing UI hooks.
- KTD4. Motion library is **Motion** (`motion` / `motion/react`), not a second animation framework. GSAP/Lenis are out unless editorial smooth-scroll becomes a proven need; prefer native scroll + Motion viewport reveals per master prompt §31.
- KTD5. URL normalization lives in `lib/url/normalize.ts`: lowercase host, strip trailing slash (except root), strip common tracking params (`utm_*`, `fbclid`, etc.), stable protocol. Validation via Zod in `lib/url/validation.ts`.
- KTD6. Metadata extraction in `lib/url/metadata.ts` + `POST /api/urls/preview`: fetch HTML server-side, parse Open Graph / Twitter / favicon / title; timeout and size limits; never trust client-supplied preview URLs without allowlisting https.
- KTD7. Design tokens in `app/globals.css` as CSS variables; Tailwind theme maps to those variables. Chillax via `@font-face` in globals + `next/font/local` if files are local.
- KTD8. Card 3D tilt is a small client hook (`hooks/useCardTilt.ts`) applied only when pointer-fine + reduced-motion off. Featured card is first/most-recent or explicitly flagged later; v1 uses most-recent as featured span without breaking grid rhythm excessively.
- KTD9. Filters: `All` shows everything; `Recent` sorts by `created_at` desc (default sort); category chips filter `category = chip`. Tags are stored but not required for v1 chip UI.
- KTD10. Forms: React Hook Form + Zod resolver only in Add URL panel. Toasts: Sonner, styled to warm tokens. Icons: Lucide React only.
- KTD11. Image strategy: `next/image` with remotePatterns for https; always reserve aspect-ratio box; fallback composition component when `preview_image` null/error.
- KTD12. Testing baseline for greenfield: Vitest (or Jest if preferred by scaffold) for pure URL utils; Playwright smoke later in U12. Do not block UI units on full E2E until core CRUD works.

### Assumptions

- Repo is greenfield aside from the master prompt markdown.
- Single shared library dataset is acceptable for v1 (personal tool / portfolio demo).
- “Motion” in the master stack means the Motion One / Framer Motion lineage package published as `motion`.
- UI UX Pro Max / Taste / Impeccable are process skills during implementation, not runtime npm deps.

### High-Level Technical Design

```text
┌─────────────────────────────────────────────────────────────┐
│ app/layout.tsx  — Chillax, tokens, providers, Sonner        │
│ app/page.tsx    — Library experience (RSC shell + client)   │
└────────────────────────────┬────────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
 components/navigation   components/library     components/motion
 Navbar, MobileNav       Search, Filters,       Reveal, Parallax,
                         Grid, Card*, AddURL,   Magnetic (desktop)
                         Empty, Loading
                             │
                             ▼
                      hooks + TanStack Query
                             │
                             ▼
                 app/api/urls/*  Route Handlers
                             │
                             ▼
              lib/supabase/server.ts (service)
                             │
                             ▼
                     Supabase Postgres `urls`
```

**Add URL state machine (UI):** `idle → validating → analyzing → preview_ready | duplicate | error → saving → success`.

**Data model (`urls`):**

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| url | text | original paste |
| normalized_url | text | UNIQUE |
| title | text | |
| description | text nullable | |
| domain | text | |
| favicon_url | text nullable | |
| preview_image | text nullable | |
| category | text nullable | enum-like string |
| tags | text[] nullable | optional |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Implementation Constraints

- CONTENT > VISUAL HIERARCHY > MOTION > DECORATION
- Minimal UI kit: Button, Input, GlassPanel, Tooltip, Modal only
- No purple gradients, no auth pages, no KPI dashboard cards
- Animate transform/opacity only

### Sequencing

1. Scaffold + tokens + fonts (U1–U2)
2. Supabase schema + server client + API CRUD/preview (U3–U4)
3. Library shell + search/filter wiring (U5–U6)
4. Card system + fallback media (U7)
5. Add URL flow + duplicates + delete (U8–U9)
6. Motion / depth / micro-interactions (U10)
7. Responsive + a11y + performance (U11)
8. Visual QA + acceptance sweep (U12)

### Research Brief

- Greenfield: no existing app code; graph tools unavailable until code exists.
- Honor master prompt structure §10; do not invent parallel folder taxonomies.
- Before pixel work, run design skill context (`my-frontend-skills` / Impeccable init) per project rules; produce `DESIGN.md` only if the design skill requires it and it does not fight the master prompt.

---

## Implementation Units

### Unit Index

| U-ID | Title | Primary files | Depends on |
|---|---|---|---|
| U1 | Scaffold Next.js app + tooling | `package.json`, `app/`, `tsconfig.json` | — |
| U2 | Design tokens, Chillax, base providers | `app/globals.css`, `app/layout.tsx`, `public/fonts/` | U1 |
| U3 | Supabase schema + server client | `supabase/migrations/`, `lib/supabase/` | U1 |
| U4 | URL domain libs + API routes | `lib/url/`, `app/api/urls/` | U3 |
| U5 | Library page shell + navigation | `app/page.tsx`, `components/navigation/` | U2 |
| U6 | Search, filters, query hooks | `hooks/`, `components/library/URLSearch.tsx`, `URLFilters.tsx` | U4, U5 |
| U7 | URL card + grid + states | `components/library/URLCard*.tsx`, `URLGrid.tsx`, … | U6 |
| U8 | Add URL panel + preview flow | `components/library/AddURL.tsx`, preview API | U4, U7 |
| U9 | Delete + open + context actions | card menu, delete confirm, toasts | U7, U8 |
| U10 | Motion system + 3D tilt + depth | `components/motion/`, `hooks/useCardTilt.ts` | U7–U9 |
| U11 | Responsive, a11y, performance pass | cross-cutting | U10 |
| U12 | Visual QA + acceptance checklist | docs notes / fixes | U11 |

### U1. Scaffold Next.js app and project tooling

**Goal:** Create a typed Next.js App Router project with Tailwind, ESLint, and the folder skeleton from the master prompt.

**Requirements:** R1 (route surface ready), R23

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `components/**` (placeholders ok), `lib/utils.ts`, `types/url.ts`, `.env.example`, `.gitignore`
- Avoid: any `app/login`, `app/signup`, auth middleware

**Approach:**
- `create-next-app` with TypeScript, App Router, Tailwind, ESLint, `src/` **not** used (keep root `app/` as specified).
- Add dependencies: `@supabase/supabase-js`, `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zod`, `sonner`, `lucide-react`, `motion`, `clsx`/`tailwind-merge` as needed.
- Stub empty folders matching §10.

**Test scenarios:**
- `pnpm`/`npm run build` succeeds on the stub page.
- No auth routes exist in `app/`.

**Verification:** Dev server renders a blank Cloud-background page at `/`.

---

### U2. Design tokens, Chillax typography, and app providers

**Goal:** Establish the visual foundation: CSS variables, font loading, QueryClientProvider, Sonner, base body styles.

**Requirements:** R11, R12, R13, R14, R15

**Files:**
- Create/modify: `public/fonts/Chillax-*.woff2` (user-supplied), `app/globals.css`, `app/layout.tsx`, `components/providers/AppProviders.tsx`, `components/ui/{Button,Input,GlassPanel,Tooltip,Modal}.tsx`

**Approach:**
- Map Cloud/Fog/Stone/Slate/Ink + surface/text/border tokens exactly from §08.
- Shadow/glass/radius/spacing/motion CSS variables from §§45–47, §60.
- Minimal UI primitives using tokens only; GlassPanel encodes the glass recipe from §09.
- `AppProviders` wraps TanStack Query + Sonner.

**Test scenarios:**
- Computed `--color-cloud` equals `#F2EFEC`.
- Body text uses Chillax; no Inter/Roboto/Arial as primary.

**Verification:** Layout shows correct canvas color and font in DevTools.

---

### U3. Supabase schema and server client — DEFERRED

**Status:** Deferred by user (2026-09-21). Do not create migrations, Supabase clients, RLS, or env DB keys in this build.

**Interim substitute:** `lib/url/store.ts` in-memory repository used by Route Handlers (U4). Same API contracts so Supabase can replace the store later.

**Goal (later):** Persist URLs in Postgres with uniqueness on `normalized_url`.

---

### U4. URL domain libraries and API routes

**Goal:** Normalize/validate URLs; expose list/create/delete/preview JSON APIs.

**Requirements:** R2, R3, R4, R7

**Files:**
- Create: `types/url.ts`, `lib/url/normalize.ts`, `lib/url/validation.ts`, `lib/url/metadata.ts`
- Create: `app/api/urls/route.ts` (GET list, POST create), `app/api/urls/[id]/route.ts` (DELETE, optional PATCH), `app/api/urls/preview/route.ts`
- Test: `lib/url/normalize.test.ts`, `lib/url/validation.test.ts`

**Approach:**
- Zod schemas shared between API and form.
- GET supports optional `q` and `category` query params (server filter) but client-side filter is also acceptable for small datasets — pick **client filter after full GET** for v1 simplicity unless list grows; document choice in code comment.
- POST create: normalize → duplicate check → insert → return row or `409` with existing row.
- Preview: validate URL → fetch metadata → return DTO; never write DB.

**Interfaces (produce):**
- `normalizeUrl(input: string): string`
- `urlInputSchema` / `UrlRecord` type matching DB columns
- `GET /api/urls` → `{ urls: UrlRecord[] }`
- `POST /api/urls` → `201 UrlRecord` | `409 { code: "duplicate", url: UrlRecord }`
- `POST /api/urls/preview` → `PreviewDTO`
- `DELETE /api/urls/:id` → `204`

**Test scenarios:**
- Normalization strips `utm_source` and lowercases host.
- Invalid URL fails Zod.
- Duplicate POST returns 409 with existing entity.
- Preview timeout returns controlled error JSON, not 500 HTML.

**Verification:** Unit tests pass; manual curl against local API.

---

### U5. Library page shell and navigation

**Goal:** Compose the homepage experience structure without cards fully finished.

**Requirements:** R1, R6, R9 (empty shell), storytelling copy §30

**Files:**
- Modify: `app/page.tsx`
- Create: `components/navigation/Navbar.tsx`, `components/navigation/MobileNav.tsx`, `components/library/LibraryIntro.tsx`
- Create: `app/library/page.tsx` (redirect)

**Approach:**
- Compact glass nav; brand “LinkNest” as primary identity signal in the library header (not only nav text).
- Intro line tone: collection / things worth keeping — subtle, not marketing hero bloat.
- Scroll behavior: nav can gain stronger glass after scroll (§14) via simple scroll listener / Motion.

**Test scenarios:**
- `/` shows nav + intro regions with landmarks/`h1`.
- `/library` redirects to `/`.
- No auth links in nav.

**Verification:** Manual desktop/mobile header check.

---

### U6. Search, filters, and data hooks

**Goal:** Wire TanStack Query list fetching and editorial search/filter controls.

**Requirements:** R7, R8, R9

**Files:**
- Create: `hooks/useUrls.ts`, `hooks/useUrlFilters.ts`, `components/library/URLSearch.tsx`, `components/library/URLFilters.tsx`

**Approach:**
- `useUrls` queries `GET /api/urls`.
- `useUrlFilters` holds search string + active chip; derives filtered list memo-free unless repo adopts React Compiler — follow local convention; otherwise simple derive in render is fine for hundreds of items.
- Filter chips styled per §17 (Ink selected, Fog border unselected).

**Test scenarios:**
- Search “design” narrows visible set by title/domain/description.
- Category chip “Tools” shows only `category === "Tools"`.
- “Recent” orders by newest first.

**Verification:** With seeded rows, UI filters correctly.

---

### U7. URL card, grid, loading, empty, featured treatment

**Goal:** Ship the primary editorial card system and grid.

**Requirements:** R5, R6, R9, R11–R14, R21

**Files:**
- Create: `components/library/URLCard.tsx`, `URLCardMedia.tsx`, `URLCardMeta.tsx`, `URLGrid.tsx`, `EmptyLibrary.tsx`, `LoadingGrid.tsx`, `URLCardFallback.tsx`

**Approach:**
- Media-dominant card; domain micro label; Chillax title; muted description clamp.
- Grid: CSS grid 3/2/1; slight masonry feel via optional featured span or varied media aspect — keep predictable to avoid jank (§24).
- Fallback media: geometric warm composition + favicon + domain.
- Open control: external link with `rel="noopener noreferrer"`.

**Test scenarios:**
- Missing `preview_image` never shows broken icon.
- Loading skeleton matches grid columns.
- Empty state copy matches calm archive tone.

**Verification:** Seeded library looks editorial at 1440px.

---

### U8. Add URL glass panel and smart preview flow

**Goal:** Premium add experience with analyzing states and preview confirmation.

**Requirements:** R3, R4, R9, R10 (toast on save), R13

**Files:**
- Create: `components/library/AddURL.tsx`, `hooks/useAddUrl.ts`
- Modify: Navbar CTA to open modal; `components/ui/Modal.tsx` focus trap

**Approach:**
- RHF + Zod for URL field; optional title/description/category/tags override after preview.
- State machine UI labels: Analyzing → Preview ready.
- On 409 duplicate: calm panel content + “View existing” (scroll/highlight card) + Cancel.
- Save invalidates `["urls"]` query; Sonner success.

**Test scenarios:**
- Valid new URL → preview → save → card appears.
- Duplicate → no second insert; existing surfaced.
- Escape and backdrop close modal; focus returns to opener.

**Verification:** Full F2/F3 manual path.

---

### U9. Delete, copy, and card context actions

**Goal:** Complete card utilities without cluttering the editorial face.

**Requirements:** R2, R10, §50–§51

**Files:**
- Modify: `URLCard.tsx` / small `URLCardMenu.tsx`
- Create: delete confirm using Modal

**Approach:**
- Three-dot menu: Open, Copy link, Delete.
- Copy → Lucide check morph / toast.
- Delete → confirm → `DELETE` API → exit motion → toast.

**Test scenarios:**
- Copy writes clipboard and announces success.
- Delete removes row from UI and DB.
- Keyboard can operate menu and confirm.

**Verification:** CRUD round-trip complete.

---

### U10. Motion system, micro-interactions, and card depth

**Goal:** Apply intentional motion and tactile depth without gimmicks.

**Requirements:** R15–R19, R22 (motion subset)

**Files:**
- Create: `components/motion/Reveal.tsx`, `Parallax.tsx`, `Magnetic.tsx`, `hooks/useCardTilt.ts`, `hooks/usePrefersReducedMotion.ts`
- Modify: cards, filters, buttons, AddURL modal, grid entrance

**Approach:**
- Shared easing curves via CSS variables / Motion transition presets.
- Staggered grid entrance once; scroll reveals for intro/sections only.
- Tilt + pointer highlight on fine pointer only.
- Disable magnetic/tilt/heavy parallax on touch and reduced motion.

**Test scenarios:**
- Reduced-motion: no tilt, minimal travel.
- Touch device emulation: tap states work; tilt off.
- Hover desktop: depth within ±3° and translateY ~-4px.

**Verification:** Motion QA against §60–§61 “why is this moving?”

---

### U11. Responsive, accessibility, and performance pass

**Goal:** Meet §40–§44 and §42–§43 systematically.

**Requirements:** R6, R20, R21, R22

**Files:** Cross-cutting; `next.config.ts` image remotePatterns; font `display: swap`; possible dynamic import for tilt

**Approach:**
- Redesign mobile nav intentionally (not scaled desktop).
- Audit focus rings on Cloud/Ink surfaces for contrast.
- Modal focus trap + Escape already from U8 — verify.
- Lighthouse / manual: LCP font & image, CLS from aspect-ratio, JS bundle sanity (no accidental three.js).

**Test scenarios:**
- Breakpoints 1920/1440/1024/768/390/360 layouts correct.
- Keyboard-only complete add + delete + open.
- No animation of width/height/top/left in shipped CSS/Motion.

**Verification:** Checklist §67 Accessibility + Performance + Responsive marked.

---

### U12. Visual QA and final acceptance sweep

**Goal:** Human-designed quality bar; fix AI-template tells.

**Requirements:** R22, R24, §62–§67

**Files:** Fix whatever QA finds; optional short `docs/qa/visual-pass-notes.md` only if useful (skip if empty)

**Approach:**
- Inspect real UI at listed widths.
- Remove excess glass, bounce, purple, empty hero bloat, identical cards, over-animation.
- Confirm auth absence one more time (routes, components, copy).

**Test scenarios:**
- Full §67 Product/Technology/Design/Motion/A11y/Perf/Responsive/Visual QA checklists.

**Verification:** Plan Definition of Done satisfied; ready to ship.

---

## Verification Contract

**Commands (after scaffold; adjust package manager):**

```bash
npm run lint
npm run test
npm run build
npm run dev
```

**API smoke (local):**

```bash
curl -s http://localhost:3000/api/urls
curl -s -X POST http://localhost:3000/api/urls/preview -H "content-type: application/json" -d "{\"url\":\"https://example.com\"}"
```

**Quality gates:**
- Unit tests for normalize/validate must pass before U8.
- `next build` must pass before U12 sign-off.
- Manual a11y keyboard pass required (no automated a11y gate yet — add `axe` later if desired).
- Visual QA is mandatory and blocking (§62).

**Behavioral evaluation:** Walk F1–F4 on desktop and mobile widths; confirm AE1–AE5.

---

## Definition of Done

**Global:**
- All Implementation Units U1–U12 complete or explicitly waived in writing by the user
- Master prompt §67 checklists satisfied
- No auth surfaces remain
- Abandoned experiment code (extra deps, unused R3F, dead routes) removed
- `.env.example` documents required keys without secrets
- App builds cleanly

**Per-unit:** Each unit’s Verification section passes; tests listed for that unit are green where applicable.

---

## Appendix

### Global constraints (carry into every unit)

- Chillax only; warm monochrome shell; selective glass; editorial cards
- No auth; no SaaS dashboard tropes; no purple AI gradients
- Stack: Next.js, React, TS, Tailwind, Supabase, TanStack Query, RHF, Zod, Sonner, Motion, Lucide
- Prefer transform/opacity; honor `prefers-reduced-motion`
- Keep architecture small — no unnecessary abstractions

### Suggested env

```bash
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# optional if client reads ever needed:
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Mapping to master prompt phases

| Master §64 phase | Units |
|---|---|
| Research / Deconstruct / Story | Done in this plan (Product + Planning Contracts) |
| Design system | U2 |
| Compose + Implement | U5–U9 |
| Animate + Depth | U10 |
| Responsive / A11y / Perf | U11 |
| Visual QA | U12 |
