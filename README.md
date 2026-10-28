# LinkNest

A calm, visual place to keep the URLs you actually return to.

Most bookmark tools feel like spreadsheets. LinkNest feels closer to a small gallery — paste a link, get a real preview, and browse what you saved the way you’d flip through a well-kept moodboard. No account wall. No noisy dashboard. Just a personal archive that looks like it belongs on your desk.

Crafted by [Divines Code](https://divinescode.com/) · Designed & developed by [Jayesh Patil](https://jayeshbpatil.com/) & [Mahendra Nagpure](https://mahendranagpure.com/)

---

## Why it exists

We keep saving links and then lose them in browser folders, Slack threads, and random notes. LinkNest is built for that quieter habit: capture something worth remembering, see it again later as a visual card, and find it without hunting.

It’s a personal URL library — editorial in tone, practical in use.

---

## What you can do

- **Paste a URL** from the hero bar (or `Ctrl`/`Cmd` + `V` anywhere) and LinkNest reads the page title, description, favicon, and preview image
- **Browse a visual grid** of saved links with category chips and live search
- **Set covers** by dropping a screenshot or pasting an image URL
- **Avoid duplicates** — if a link is already in the archive, you’re taken back to the existing card
- **Install as a PWA** on phone or desktop when you want it as a home-screen app
- **Respect motion preferences** — reduced-motion users get a quieter experience without losing the product

---

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Data / forms | TanStack Query, React Hook Form, Zod |
| API | Fastify 5 (`/api/*`) |
| Database | Supabase (PostgreSQL) + Storage for cover uploads |
| Deploy | Vercel (Next pages + serverless Fastify via `api/index.js`) |

Locally, Next rewrites `/api/*` to the Fastify process on port `4000`. On Vercel, the same routes are handled by the serverless entry.

---

## Project shape

```text
LinkNest/
├── app/                 # Next.js App Router (home, library, PWA manifest)
├── components/          # Library UI, motion, navigation, providers
├── hooks/               # URLs, filters, tilt, PWA
├── lib/                 # URL helpers, motion presets, validation
├── types/               # Shared TypeScript models
├── api/                 # Vercel serverless bridge to Fastify
└── backend/             # Fastify API, Supabase client, scripts
```

For a deeper walkthrough of architecture and flows, see [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md). Backend-specific notes live in [`backend/README.md`](./backend/README.md).

---

## Getting started

### 1. Install

```bash
npm install
npm install --prefix backend
```

### 2. Environment

Secrets stay in the backend. Copy the example file and fill it in:

```bash
cp backend/.env.example backend/.env
```

You’ll need:

```env
PORT=4000
HOST=0.0.0.0
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

Do **not** put the service role key in a frontend env file or commit it to git.

If you use the `Reference` category, also run the SQL in `backend/sql/2026-09-28-reference-category.sql` once in the Supabase SQL editor so the database check constraint allows it.

### 3. Run

```bash
npm run dev
```

- Web: [http://localhost:3000](http://localhost:3000)
- API: [http://localhost:4000](http://localhost:4000) (`/api/health`, `/api/urls`, …)

Useful scripts:

```bash
npm run dev:web     # Next only
npm run dev:api     # Fastify only
npm run lint
npm test
npm run test:db     # API + database smoke check (API should be running)
```

---

## Deploying on Vercel

1. Import the repo as a Next.js project.
2. Add these environment variables in the Vercel dashboard (Production + Preview):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `CORS_ORIGIN` — your deployment URL, e.g. `https://your-app.vercel.app`
3. Deploy.

Pages ship as Next.js. `/api/*` goes through `api/index.js` into Fastify, with `backend/**` included for the function.

---

## Design notes

LinkNest leans warm and quiet on purpose — cream surfaces, soft glass panels, Chillax type, and restrained motion. Cards are meant to feel tactile without turning into a gadget demo. Prefers-reduced-motion is treated as a first-class path, not an afterthought.

---

## License & credit

Private project for now. If you’re reading this as a collaborator or reviewer: thanks for looking carefully — the product is small on purpose, and the craft is in the details.
