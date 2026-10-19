"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { toast } from "sonner";
import { usePWA } from "@/hooks/usePWA";
import { PWAInstallModal } from "./PWAInstallPrompt";

interface PWAContextType {
  isStandalone: boolean;
  isIOS: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<void>;
  openIOSGuide: () => void;
}

const PWAContext = createContext<PWAContextType | null>(null);

export function usePWAContext() {
  const ctx = useContext(PWAContext);
  if (!ctx) {
    throw new Error("usePWAContext must be used within a PWAProvider");
  }
  return ctx;
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const pwa = usePWA();
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Register service worker for PWA installability and Web Share Target support
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          // Check for waiting updates
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
          }

          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener("statechange", () => {
                if (
                  installing.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setWaitingWorker(installing);
                  toast.info("A new version of LinkNest is available.", {
                    action: {
                      label: "Update",
                      onClick: () => {
                        installing.postMessage({ type: "SKIP_WAITING" });
                        window.location.reload();
                      },
                    },
                    duration: 8000,
                  });
                }
              });
            }
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });

      // Reload when new worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }, []);

  // Web Share Target API query parameter handler for root /
  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const action = searchParams.get("action");
    const sharedUrl = searchParams.get("url") || "";
    const sharedTitle = searchParams.get("title") || "";
    const sharedText = searchParams.get("text") || "";

    if (action === "share" || sharedUrl || sharedText || action === "add") {
      // Find actual URL from text if url parameter is empty
      let targetUrl = sharedUrl;
      if (!targetUrl && sharedText) {
        const urlMatch = sharedText.match(/https?:\/\/[^\s]+/i);
        if (urlMatch) targetUrl = urlMatch[0];
        else if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(sharedText.trim())) {
          targetUrl = `https://${sharedText.trim()}`;
        }
      }

      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("linknest:open-add", {
            detail: {
              url: targetUrl || sharedText,
              title: sharedTitle,
              autoSubmit: Boolean(targetUrl),
            },
          }),
        );
      }, 400);

      // Clean up search params without full page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  // Sync offline queue if items were saved during mobile share while offline
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.onLine) return;

    try {
      const rawQueue = localStorage.getItem("linknest_offline_queue");
      if (!rawQueue) return;
      const queue = JSON.parse(rawQueue);
      if (Array.isArray(queue) && queue.length > 0) {
        toast.promise(
          Promise.all(
            queue.map((item) =>
              fetch("/api/urls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url: item.url,
                  title: item.title,
                  tags: ["Mobile Share", "Offline Sync"],
                }),
              }),
            ),
          ).then(() => {
            localStorage.removeItem("linknest_offline_queue");
            window.dispatchEvent(new Event("linknest:refresh-urls"));
          }),
          {
            loading: `Syncing ${queue.length} offline saved link${queue.length > 1 ? "s" : ""}...`,
            success: "All offline shared links synced to your library!",
            error: "Could not sync some offline links.",
          },
        );
      }
    } catch (e) {
      console.warn("[PWA] Offline queue sync error:", e);
    }
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isStandalone: pwa.isStandalone,
        isIOS: pwa.isIOS,
        canInstall: pwa.canInstall,
        isInstalled: pwa.isInstalled,
        promptInstall: pwa.promptInstall,
        openIOSGuide: () => pwa.setShowIOSGuide(true),
      }}
    >
      {children}
      <PWAInstallModal
        open={pwa.showIOSGuide}
        onClose={() => pwa.setShowIOSGuide(false)}
      />
    </PWAContext.Provider>
  );
}
