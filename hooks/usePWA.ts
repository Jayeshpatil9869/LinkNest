"use client";

import { useEffect, useState, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone mode (iOS or Android/Desktop)
    const checkStandalone = () => {
      const isDisplayStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;
      const isNavigatorStandalone = Boolean(
        (window.navigator as unknown as { standalone?: boolean }).standalone,
      );
      const standalone = isDisplayStandalone || isNavigatorStandalone;
      setIsStandalone(standalone);
      if (standalone) setIsInstalled(true);
    };

    checkStandalone();

    // Detect iOS & Safari
    const ua = window.navigator.userAgent;
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === "MacIntel" &&
        window.navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const isSafariBrowser =
      /Safari/.test(ua) &&
      !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
    setIsSafari(isSafariBrowser);

    // Listen for beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIOSGuide(false);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  }, [deferredPrompt, isIOS]);

  const canInstall = !isStandalone && (Boolean(deferredPrompt) || isIOS);

  return {
    isStandalone,
    isIOS,
    isSafari,
    canInstall,
    isInstalled,
    showIOSGuide,
    setShowIOSGuide,
    promptInstall,
  };
}
