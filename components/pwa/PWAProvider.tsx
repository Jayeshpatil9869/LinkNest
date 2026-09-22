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

  // Register service worker
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
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

  // Web Share Target API query parameter handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const action = searchParams.get("action");
    const sharedUrl = searchParams.get("url") || "";
    const sharedTitle = searchParams.get("title") || "";
    const sharedText = searchParams.get("text") || "";

    if (action === "share" || sharedUrl || action === "add") {
      // Find actual URL from text if url is empty
      let targetUrl = sharedUrl;
      if (!targetUrl && sharedText) {
        const urlMatch = sharedText.match(/https?:\/\/[^\s]+/i);
        if (urlMatch) targetUrl = urlMatch[0];
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
      }, 300);

      // Clean up search params without full page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
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
