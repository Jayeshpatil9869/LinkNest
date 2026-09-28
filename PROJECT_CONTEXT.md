# LinkNest — Complete Project Context & Architectural Overview

> **Version:** 0.1.0  
> **Repository:** `Jayeshpatil9869/LinkNest`  
> **Authors / Credits:** Crafted by [Divines Code](https://divinescode.com/), Designed & Developed by [Jayesh Patil](https://jayeshbpatil.com/) & [Mahendra Nagpure](https://mahendranagpure.com/).  
> **Last Updated:** September 2026

---

## 1. Executive Summary & Vision

**LinkNest** is a high-craft, visual-first personal web archive and editorial bookmark manager. Unlike traditional list-heavy, utilitarian bookmarking tools or enterprise dashboard suites, LinkNest is engineered as a curated digital gallery:
- **Zero Authentication Required:** Instant access to the library without login screens, registration friction, or walled gardens.
- **Editorial Design Language:** Powered by a warm monochrome palette (Cloud, Fog, Stone, Slate, Ink), tactile glassmorphism, and the *Chillax* display typeface.
- **High-Fidelity Visual Previews:** Automatic OpenGraph image scraping, fallback gradient generation, domain parsing, and favicon extraction.
- **Fluid Micro-Interactions & Motion:** Integrated WebGL/GLSL shader fluid background, 3D card tilt with specular pointer highlights, GSAP entrance animations, and Lenis smooth scrolling.
- **PWA Ready:** Full Progressive Web App support with custom installation prompts for iOS, Android, and desktop.

---

## 2. Technology Stack & Ecosystem

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 16 + React 19)            │
│  - App Router (React Server Components + Client Islands)         │
│  - Styling: Tailwind CSS v4 + Custom Design Tokens (CSS vars)     │
│  - Motion: Motion (Framer v13), GSAP 3.15 + ScrollTrigger, Lenis │
│  - State & Data: @tanstack/react-query, React Hook Form + Zod    │
│  - UI Polish: Sonner (Toasts), Lucide Icons, Custom GLSL Shader  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                     HTTP / Rewrites (/api/*)
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      BACKEND (Fastify 5 Server / Serverless)     │
│  - API Framework: Fastify 5 with @fastify/cors & @fastify/helmet │
│  - Runtime: Node.js (Standalone server or Vercel Serverless)     │
│  - Validation: Zod schemas for URLs, Metadata & Categories       │
│  - Metadata Extractor: HTML Parser, OG/Twitter tags, Favicons    │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
                         PostgreSQL SDK
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      PERSISTENCE (Supabase Database)             │
│  - PostgreSQL with `urls` table & unique `normalized_url` index  │
└──────────────────────────────────────────────────────────────────┘
```

### Core Frontend Stack
- **Framework:** Next.js `16.3.5` (App Router)
- **Runtime Library:** React `19.2.8` & React DOM `19.2.8`
- **Styling:** Tailwind CSS `v4` (`@tailwindcss/postcss`) with CSS variables design tokens
- **Typography:** Self-hosted *Chillax* variable font
- **Motion & 3D:**
  - `@gsap/react` `2.1.2` & `gsap` `3.15.0`
  - `motion` `13.4.0`
  - `lenis` `1.3.26` (smooth inertia scrolling)
  - Custom WebGL / Three.js-based Shader Background (`mesh-portfolio.tsx`)
- **Data & Forms:**
  - `@tanstack/react-query` `5.103.2`
  - `react-hook-form` `7.88.0` + `@hookform/resolvers` `5.9.1`
  - `zod` `3.25.76`
  - `sonner` `2.0.8` (notifications/toasts)

### Core Backend Stack
- **Framework:** Fastify `5.2.1`
- **Security:** `@fastify/cors` `10.0.2`, `@fastify/helmet` `13.0.1`
- **Database Client:** `@supabase/supabase-js` `2.116.0`
- **Deployment Adapter:** Vercel Serverless entry (`api/index.js` -> `backend/src/vercel.js`)

---

## 3. Architecture & Project Layout

```
LinkNest/
├── AGENTS.md                                # Next.js agent execution rules
├── LinkNest_Master_Design_Build_Prompt.md   # Design and product master specification
├── PROJECT_CONTEXT.md                       # Comprehensive project documentation
├── package.json                             # Root scripts & dependencies
├── next.config.ts                           # Next.js config & dev API rewrites
├── postcss.config.mjs                       # Tailwind CSS PostCSS plugin config
├── tsconfig.json                            # TypeScript configuration
├── vercel.json                              # Vercel serverless function & routing configuration
│
├── api/
│   └── index.js                             # Vercel serverless entrypoint for /api/*
│
├── app/
│   ├── layout.tsx                           # Root layout (fonts, metadata, providers, PWA prompt)
│   ├── page.tsx                             # Home page rendering <LibraryExperience />
│   ├── globals.css                          # Global design tokens, warm palette, glass classes
│   ├── manifest.ts                          # Dynamic PWA Web App Manifest
│   ├── apple-icon.tsx                       # Apple touch icon generation
│   ├── icon.svg & favicon.ico               # Brand icons
│   └── library/
│       └── page.tsx                         # Direct library route alias
│
├── backend/                                 # Fastify API Service
│   ├── package.json                         # Backend standalone scripts & dependencies
│   ├── scripts/
│   │   ├── import-urls.js                   # Batch import script for initial URL seed data
│   │   └── smoke-test.js                    # API & DB sanity test script
│   └── src/
│       ├── app.js                           # Fastify instance builder & middleware configuration
│       ├── server.js                        # Node server entry for local execution (port 4000)
│       ├── vercel.js                        # Vercel serverless Fastify request handler
│       ├── lib/
│       │   ├── env.js                       # Environment validation & loading
│       │   ├── mapUrl.js                    # DB row <-> frontend schema mapping & preview fallback
│       │   ├── metadata.js                  # Scrapes HTML OpenGraph, title, description, favicon
│       │   ├── normalize.js                 # URL normalization (strips trailing slashes, UTM params)
│       │   ├── supabase.js                  # Supabase client singleton
│       │   └── validation.js                # Zod schemas for POST /urls, /urls/preview
│       └── routes/
│           ├── health.js                    # GET /api/health check route
│           └── urls.js                      # GET/POST/DELETE /api/urls and POST /api/urls/preview
│
├── components/
│   ├── library/                             # Core library UI components
│   │   ├── LibraryExperience.tsx            # Orchestration layer for the entire library view
│   │   ├── HeroSection.tsx                  # Hero with GLSL shader background, smart paste bar
│   │   ├── LibraryToolbar.tsx               # Client search bar + category filter chips
│   │   ├── URLGrid.tsx                      # 3-column / 2-column / 1-column responsive card grid
│   │   ├── URLCard.tsx                      # Rich preview card with 3D tilt, actions, domain badge
│   │   ├── URLCardMedia.tsx                 # Preview image with loading state & fallback gradient
│   │   ├── URLCardMeta.tsx                  # Card domain, timestamp, category & tags
│   │   ├── URLCardFallback.tsx              # Beautiful typographic fallback when no image exists
│   │   ├── URLSearch.tsx                    # Search input with clear button & keyboard shortcuts
│   │   ├── URLFilters.tsx                   # Category pills ("All", "Design", "Development", etc.)
│   │   ├── AddURL.tsx                       # Modal panel for URL analysis, edit, and confirmation
│   │   ├── EmptyLibrary.tsx                 # Empty state with visual prompt to add first link
│   │   └── LoadingGrid.tsx                  # Skeleton cards for library loading state
│   ├── motion/                              # Animation primitives
│   │   ├── Reveal.tsx                       # Fade/slide reveal wrapper with Framer Motion
│   │   ├── Parallax.tsx                     # Subtle scroll parallax effect
│   │   └── Pressable.tsx                    # Micro-scale interaction on click/tap
│   ├── navigation/
│   │   └── Navbar.tsx                       # Sticky glass navigation with live counter & quick actions
│   ├── providers/
│   │   ├── AppProviders.tsx                 # TanStack QueryClient provider & Sonner toaster
│   │   └── SmoothScrollProvider.tsx         # Lenis smooth scrolling orchestrator
│   ├── pwa/
│   │   ├── PWAProvider.tsx                  # PWA context (beforeinstallprompt, iOS standalone check)
│   │   └── PWAInstallPrompt.tsx             # Floating glass install banner with step-by-step guidance
│   └── ui/                                  # Primitive design system components
│       ├── Button.tsx                       # Styled button with variants (primary, secondary, ghost)
│       ├── GlassPanel.tsx                   # Frosted glass panel with specular border
│       ├── Input.tsx                        # Accessible form text input
│       ├── Modal.tsx                        # Accessible dialog with backdrop blur & keyboard trap
│       └── mesh-portfolio.tsx               # Interactive WebGL GLSL fluid shader canvas
│
├── hooks/
│   ├── useUrls.ts                           # React Query hook for fetching and caching URLs
│   ├── useUrlFilters.ts                     # Filter logic (search text, category chip, sort order)
│   ├── useCardTilt.ts                       # Pointer 3D tilt math & specular highlight calculation
│   ├── usePWA.ts                            # PWA install prompt state and action hook
│   └── usePrefersReducedMotion.ts           # Accessibility hook checking OS motion preferences
│
├── lib/
│   ├── utils.ts                             # `cn()` clsx + twMerge utility
│   ├── motion/
│   │   └── presets.ts                       # Motion tokens, GSAP presets, shake animations
│   └── url/
│       ├── metadata.ts                      # Client-side metadata fallback helpers
│       ├── normalize.ts                     # URL normalization routines
│       ├── preview-image.ts                 # Domain-based seed colors and fallback generators
│       ├── store.ts                         # Local storage backup/offline store
│       └── validation.ts                    # URL regex & scheme verification
│
├── public/
│   ├── fonts/                               # Self-hosted Chillax fonts (.woff2)
│   ├── icons/                               # PWA icons (192x192, 512x512, maskable)
│   ├── og-image.png                         # OpenGraph preview banner
│   └── screenshot-desktop.png               # PWA rich install screenshot
│
└── types/
    └── url.ts                               # TypeScript types (`UrlRecord`, `UrlCategory`, `UrlPreview`)
```

---

## 4. Key Workflows & User Experiences

### 4.1 Global Quick-Paste & Add Flow
1. **Direct Focus / Paste:** When the user presses `Ctrl+V` / `Cmd+V` anywhere on the page (or pastes into the Hero bar), the hero input captures the URL immediately.
2. **Metadata Analysis:** Fastify calls `POST /api/urls/preview`, which fetches the HTML of the target site, extracting:
   - OpenGraph title / standard `<title>`
   - OpenGraph description / `<meta name="description">`
   - OpenGraph image / Twitter card image
   - High-resolution favicon (`Google S2 Favicon API` fallback)
   - Auto-inferred category (`Design`, `Development`, `Inspiration`, `Tools`, `Articles`, `Resources`)
3. **Modal Verification & Customization:** The user can edit the title, description, category, or tags before saving.
4. **Duplicate Detection:** If the normalized URL already exists, the API returns `HTTP 409` with the existing record. The UI presents a calm notification and smoothly scrolls directly to the existing card in the library.

### 4.2 Browsing, Search & Filtering
- **Real-Time Client Search:** Matches against title, domain, description, URL, and assigned tags.
- **Category Chips:** Instant pill-filter switching (`All`, `Design`, `Development`, `Inspiration`, `Tools`, `Articles`, `Resources`).
- **3D Card Tilt Interaction:** Desktop cards calculate pointer `(x, y)` coordinates relative to the card dimensions, applying a gentle `rotateX`/`rotateY` (max ±3°) with dynamic specular lighting.

### 4.3 Editorial Card UI
Each URL Card displays:
- Dominant 16:9 or 4:3 preview image (or editorial typographic gradient fallback).
- Favicon and clean domain label (e.g., `github.com`).
- High-contrast title and truncated description.
- Direct external link trigger + subtle delete confirmation action.
- Category badge and tags.

---

## 5. Database Schema & Data Models

### Supabase Table: `urls`
```sql
CREATE TABLE IF NOT EXISTS public.urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  normalized_url TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  favicon_url TEXT,
  preview_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indices
CREATE UNIQUE INDEX IF NOT EXISTS urls_normalized_url_idx ON public.urls (normalized_url);
CREATE INDEX IF NOT EXISTS urls_created_at_idx ON public.urls (created_at DESC);
```

### TypeScript Definition (`types/url.ts`)
```typescript
export type UrlCategory =
  | "Design"
  | "Development"
  | "Inspiration"
  | "Tools"
  | "Articles"
  | "Resources";

export type UrlRecord = {
  id: string;
  url: string;
  normalizedUrl: string;
  title: string;
  description: string | null;
  domain: string;
  faviconUrl: string | null;
  previewImage: string | null;
  category: UrlCategory | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
```

---

## 6. Design System & Aesthetics Tokens

All design tokens are defined in `app/globals.css`:

| Token | CSS Variable | Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Cloud** | `--color-cloud` | `#FFFBF6` | Warm off-white background / card surfaces |
| **Fog** | `--color-fog` | `#ECD9C3` | Subtle border and secondary background tint |
| **Stone** | `--color-stone` | `#A78D74` | Muted typography, tertiary metadata |
| **Slate** | `--color-slate` | `#3F342C` | Secondary text, subtle icons |
| **Ink** | `--color-ink` | `#1C1612` | Primary headings, prominent body text |
| **Accent** | `--color-accent` | `#E9A56F` | Warm peach accent for focus states & highlights |
| **Mesh Gold**| `--color-mesh-gold` | `#F7D797` | Hero GLSL shader warm drift color |
| **Mesh Peach**| `--color-mesh-peach`| `#F7C097` | Hero GLSL shader soft peach color |

### Glassmorphism System
- `--glass-bg`: `rgba(255, 251, 246, 0.42)`
- `--glass-blur`: `22px`
- `--glass-saturate`: `140%`
- `--border-glass`: `rgba(255, 251, 246, 0.55)`

---

## 7. Development & Operations Guide

### Environment Variables
Frontend & Backend rely on `.env` (or `.env.local` / Vercel Environment Variables):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
# OR
SUPABASE_ANON_KEY=your-supabase-anon-key

# Fastify Backend Port (Local)
FASTIFY_PORT=4000
FASTIFY_HOST=0.0.0.0
```

### Available Scripts
```bash
# Run both Next.js (port 3000) and Fastify API (port 4000) concurrently
npm run dev

# Run only Next.js frontend
npm run dev:web

# Run only Fastify API backend
npm run dev:api

# Build Next.js application for production
npm run build

# Run Vitest unit tests
npm run test

# Test backend database connectivity and sanity
npm run test:db
```

### Deployment Strategy
- **Frontend & API (Vercel Monorepo Mode):**
  - Next.js is deployed to Vercel App Router.
  - API requests to `/api/*` are routed through `vercel.json` to `api/index.js`, which wraps Fastify as a serverless function with max 30s timeout and 1024MB memory allocation.
  - In local development, Next.js rewrites `/api/:path*` to `http://127.0.0.1:4000/api/:path*`.
