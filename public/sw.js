// LinkNest Production Service Worker
const CACHE_VERSION = "linknest-v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];

// Install: Precache shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[SW] Precache failed:", err)),
  );
});

// Activate: Purge old cache versions
self.addEventListener("activate", (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => !currentCaches.includes(name))
            .map((name) => {
              console.log("[SW] Deleting obsolete cache:", name);
              return caches.delete(name);
            }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Handle messages (e.g., skipWaiting prompt from UI)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch: Smart caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET or cross-origin chrome extensions / browser internals
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // 1. Next.js navigation / HTML requests -> Network First with Offline Fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const rootCached = await caches.match("/");
          if (rootCached) return rootCached;
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Offline — LinkNest</title>
                <style>
                  body {
                    margin: 0;
                    padding: 2rem;
                    background: #FFF7EF;
                    color: #1C1612;
                    font-family: system-ui, -apple-system, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    text-align: center;
                  }
                  .card {
                    background: rgba(255, 251, 246, 0.9);
                    border: 1px solid rgba(63, 52, 44, 0.14);
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    max-width: 400px;
                    box-shadow: 0 12px 32px rgba(28, 22, 18, 0.08);
                  }
                  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
                  p { color: #3F342C; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem; }
                  button {
                    background: #1C1612;
                    color: #FFF7EF;
                    border: none;
                    border-radius: 999px;
                    padding: 0.75rem 1.5rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                  }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>You're Offline</h1>
                  <p>LinkNest requires an internet connection to sync your links. Please check your connection and try again.</p>
                  <button onclick="window.location.reload()">Reload LinkNest</button>
                </div>
              </body>
            </html>`,
            {
              headers: { "Content-Type": "text/html" },
            },
          );
        }),
    );
    return;
  }

  // 2. Google Favicons / Images -> Cache First with Network Fallback
  if (
    url.hostname.includes("google.com") ||
    request.destination === "image" ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response.status === 200 || response.type === "opaque") {
              const copy = response.clone();
              caches.open(IMAGE_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);
      }),
    );
    return;
  }

  // 3. Static assets & fonts (Chillax, Next chunks, styles) -> Stale While Revalidate
  if (
    url.hostname.includes("fontshare.com") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.status === 200) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      }),
    );
    return;
  }

  // 4. Default: Network with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});
