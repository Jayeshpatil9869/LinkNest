# LinkNest — local & Vercel

## Credentials

Supabase keys live **only** in [`backend/.env`](.env) (gitignored).  
Copy from [`.env.example`](.env.example) and fill in locally.  
Do **not** put secrets in a frontend / repo-root `.env`.

## Local (frontend + backend together)

```bash
npm install
npm install --prefix backend
# create backend/.env from backend/.env.example
npm run dev
```

- Web: http://localhost:3000  
- API: http://localhost:4000 (`/api/health`, `/api/urls`, …)  
- Next rewrites `/api/*` → Fastify in development.

## Database smoke test

With the API running:

```bash
npm run test:db
```

## Vercel (one project)

1. Import this repo as a **Next.js** project.
2. Add env vars manually in the Vercel dashboard (Production + Preview) — do not commit them:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only)
   - `CORS_ORIGIN` = your deployment URL (e.g. `https://….vercel.app`)
3. Deploy. Pages are Next; `/api/*` is Fastify via `api/index.js`.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
