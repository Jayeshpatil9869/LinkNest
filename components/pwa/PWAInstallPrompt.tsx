"use client";

import { motion, AnimatePresence } from "motion/react";
import { Share2, PlusSquare, CheckCircle2, X, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface PWAInstallPromptProps {
  showIOSGuide: boolean;
  onCloseIOSGuide: () => void;
  canInstallAndroid: boolean;
  onPromptAndroid: () => void;
}

export function PWAInstallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[rgba(28,22,18,0.4)] backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[24px] border border-[var(--border-glass)] bg-[var(--surface-strong)] p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 text-[var(--color-stone)] transition-colors hover:bg-[rgba(63,52,44,0.06)] hover:text-[var(--color-ink)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#F7D797] via-[#F7C097] to-[#E9A56F] shadow-md">
                <span className="text-xl font-bold tracking-tight text-[#1C1612]">
                  LN
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                  Install LinkNest on iOS
                </h3>
                <p className="text-xs text-[var(--color-stone)]">
                  Add to your iPhone / iPad Home Screen
                </p>
              </div>
            </div>

            {/* Steps list */}
            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-3 rounded-[16px] bg-[rgba(255,251,246,0.8)] p-3.5 border border-[var(--border)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(233,165,111,0.2)] text-[var(--color-slate)]">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    1. Tap the Share button
                  </p>
                  <p className="text-xs text-[var(--color-stone)]">
                    Located in the Safari toolbar at the bottom or top of your screen.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[16px] bg-[rgba(255,251,246,0.8)] p-3.5 border border-[var(--border)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(233,165,111,0.2)] text-[var(--color-slate)]">
                  <PlusSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    2. Select &ldquo;Add to Home Screen&rdquo;
                  </p>
                  <p className="text-xs text-[var(--color-stone)]">
                    Scroll down in the share sheet and tap &ldquo;Add to Home Screen&rdquo;.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[16px] bg-[rgba(255,251,246,0.8)] p-3.5 border border-[var(--border)]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[rgba(233,165,111,0.2)] text-[var(--color-slate)]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink)]">
                    3. Tap &ldquo;Add&rdquo;
                  </p>
                  <p className="text-xs text-[var(--color-stone)]">
                    Confirm in the top-right corner to launch LinkNest as a native app!
                  </p>
                </div>
              </div>
            </div>

            {/* Done button */}
            <div className="mt-6">
              <Button
                variant="primary"
                className="w-full rounded-full py-3"
                onClick={onClose}
              >
                Got It
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function PWAInstallButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="soft"
      size="sm"
      className={`rounded-full gap-1.5 text-xs sm:text-sm ${className || ""}`}
      onClick={onClick}
      aria-label="Install LinkNest"
    >
      <Download className="h-3.5 w-3.5" />
      <span>Install App</span>
    </Button>
  );
}
