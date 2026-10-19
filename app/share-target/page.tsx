"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  Loader2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FolderCheck,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/Button";
import { extractDomain, normalizeUrl } from "@/lib/url/normalize";
import type { UrlRecord, UrlPreview } from "@/types/url";

function extractUrlCandidate(rawUrl: string | null, rawText: string | null): string {
  const urlCandidate = (rawUrl || "").trim();
  const textCandidate = (rawText || "").trim();

  // 1. Direct URL parameter
  if (urlCandidate && /^https?:\/\//i.test(urlCandidate)) {
    return urlCandidate;
  }

  // 2. URL embedded in shared text (common in Android Chrome, Twitter, Reddit, YouTube)
  if (textCandidate) {
    const match = textCandidate.match(/https?:\/\/[^\s]+/i);
    if (match?.[0]) return match[0];
  }

  // 3. Raw URL without protocol
  if (urlCandidate && /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(urlCandidate)) {
    return `https://${urlCandidate}`;
  }

  // 4. Raw text without protocol that looks like a domain
  if (textCandidate && /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(textCandidate)) {
    return `https://${textCandidate}`;
  }

  return urlCandidate || textCandidate;
}

function ShareTargetProcessor() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<
    "parsing" | "fetching_metadata" | "saving" | "saved" | "duplicate" | "error"
  >("parsing");
  const [extractedUrl, setExtractedUrl] = useState("");
  const [preview, setPreview] = useState<UrlPreview | null>(null);
  const [savedRecord, setSavedRecord] = useState<UrlRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    const rawUrl = searchParams.get("url");
    const rawText = searchParams.get("text");
    const rawTitle = searchParams.get("title");

    const targetUrl = extractUrlCandidate(rawUrl, rawText);
    setExtractedUrl(targetUrl);

    if (!targetUrl) {
      setStatus("error");
      setErrorMessage("No valid link was detected in the share data.");
      return;
    }

    async function processShare() {
      try {
        setStatus("fetching_metadata");

        // Step 1: Request metadata preview from backend
        let fetchedPreview: UrlPreview | null = null;
        try {
          const previewRes = await fetch("/api/urls/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: targetUrl }),
          });

          if (previewRes.status === 409) {
            // Already exists in library!
            const dupeData = await previewRes.json();
            setStatus("duplicate");
            setSavedRecord(dupeData.url);
            return;
          }

          if (previewRes.ok) {
            fetchedPreview = await previewRes.json();
            setPreview(fetchedPreview);
          }
        } catch (previewErr) {
          console.warn("[ShareTarget] Preview fetch error, falling back:", previewErr);
        }

        // Step 2: Auto-save URL to library
        setStatus("saving");
        const domain = extractDomain(targetUrl);
        const titleToSave =
          fetchedPreview?.title || (rawTitle || "").trim() || domain;
        const descToSave = fetchedPreview?.description || null;
        const faviconToSave =
          fetchedPreview?.faviconUrl ||
          `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        const previewImageToSave = fetchedPreview?.previewImage || null;
        const categoryToSave =
          fetchedPreview && "category" in fetchedPreview
            ? (fetchedPreview as { category?: string | null }).category || null
            : null;

        const saveRes = await fetch("/api/urls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: targetUrl,
            title: titleToSave,
            description: descToSave,
            faviconUrl: faviconToSave,
            previewImage: previewImageToSave,
            category: categoryToSave,
            tags: ["Mobile Share"],
          }),
        });

        if (saveRes.status === 409) {
          const dupeData = await saveRes.json();
          setStatus("duplicate");
          setSavedRecord(dupeData.url);
          return;
        }

        if (!saveRes.ok) {
          throw new Error("Failed to save link to your library.");
        }

        const savedData: UrlRecord = await saveRes.json();
        setSavedRecord(savedData);
        setStatus("saved");

        // Broadcast to existing open tabs/components
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("linknest:url-added", { detail: savedData }),
          );
        }
      } catch (err: unknown) {
        // Save to offline queue if network fails
        if (typeof window !== "undefined") {
          try {
            const offlineQueue = JSON.parse(
              localStorage.getItem("linknest_offline_queue") || "[]",
            );
            offlineQueue.push({
              url: targetUrl,
              title: rawTitle || targetUrl,
              timestamp: new Date().toISOString(),
            });
            localStorage.setItem(
              "linknest_offline_queue",
              JSON.stringify(offlineQueue),
            );
          } catch {
            // Ignore storage issues
          }
        }

        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Network error. The link has been saved to your offline queue.",
        );
      }
    }

    void processShare();
  }, [searchParams]);

  // Auto-redirect countdown on success
  useEffect(() => {
    if (status !== "saved" && status !== "duplicate") return;

    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          const targetHash = savedRecord ? `#url-${savedRecord.id}` : "#library";
          router.push(`/${targetHash}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status, savedRecord, router]);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center text-center">
      {/* Processing States */}
      {(status === "parsing" ||
        status === "fetching_metadata" ||
        status === "saving") && (
        <GlassPanel tone="strong" className="w-full rounded-[24px] p-6 sm:p-8">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(247,215,151,0.25)] border border-[rgba(233,165,111,0.4)]">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#F7D797] to-[#E9A56F] opacity-30 blur-lg" />
          </div>

          <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            {status === "parsing" && "Receiving Shared Link..."}
            {status === "fetching_metadata" && "Extracting Visual Preview..."}
            {status === "saving" && "Archiving to LinkNest..."}
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[var(--color-slate)] sm:text-sm">
            {extractedUrl ? (
              <span className="font-mono text-[11px] sm:text-xs break-all text-[var(--color-stone)]">
                {extractedUrl}
              </span>
            ) : (
              "Reading share payload from mobile browser..."
            )}
          </p>

          {preview && (
            <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[rgba(255,251,246,0.6)] p-3 text-left">
              {preview.previewImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.previewImage}
                  alt={preview.title}
                  className="h-12 w-16 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-[rgba(236,217,195,0.4)]">
                  <Globe className="h-5 w-5 text-[var(--color-stone)]" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[var(--color-ink)]">
                  {preview.title}
                </p>
                <p className="truncate text-[11px] text-[var(--color-stone)]">
                  {preview.domain}
                </p>
              </div>
            </div>
          )}
        </GlassPanel>
      )}

      {/* Success State */}
      {status === "saved" && savedRecord && (
        <GlassPanel tone="strong" className="w-full rounded-[24px] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(46,125,50,0.12)] border border-[rgba(46,125,50,0.25)] text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
            <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-emerald-400 opacity-20 blur-lg" />
          </div>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-semibold text-emerald-700">
            <Sparkles className="h-3 w-3" />
            Saved to Library
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            Link Archived Successfully!
          </h2>

          <div className="mt-5 flex items-center gap-3.5 rounded-[16px] border border-[var(--border)] bg-[rgba(255,251,246,0.7)] p-3.5 text-left shadow-sm">
            {savedRecord.previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={savedRecord.previewImage}
                alt={savedRecord.title}
                className="h-14 w-20 shrink-0 rounded-[10px] object-cover"
              />
            ) : (
              <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(236,217,195,0.4)]">
                <Globe className="h-6 w-6 text-[var(--color-stone)]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                {savedRecord.title}
              </p>
              <p className="truncate text-xs text-[var(--color-stone)]">
                {savedRecord.domain}
              </p>
              {savedRecord.category && (
                <span className="mt-1 inline-block rounded-md bg-[rgba(236,217,195,0.45)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-slate)]">
                  {savedRecord.category}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
            <Button
              onClick={() => router.push(`/#url-${savedRecord.id}`)}
              className="w-full sm:w-auto"
            >
              Open in Library ({countdown}s)
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href={savedRecord.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[12px] border border-[var(--border)] bg-[rgba(255,251,246,0.5)] px-4 text-xs font-semibold text-[var(--color-slate)] transition-colors hover:bg-[rgba(255,251,246,0.9)]"
            >
              Visit Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </GlassPanel>
      )}

      {/* Duplicate State */}
      {status === "duplicate" && savedRecord && (
        <GlassPanel tone="strong" className="w-full rounded-[24px] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(233,165,111,0.2)] border border-[rgba(233,165,111,0.35)] text-[var(--color-accent)]">
            <FolderCheck className="h-8 w-8" />
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            Already in Your Library
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[var(--color-slate)] sm:text-sm">
            This link was already saved in your LinkNest archive.
          </p>

          <div className="mt-4 flex items-center gap-3.5 rounded-[16px] border border-[var(--border)] bg-[rgba(255,251,246,0.7)] p-3.5 text-left">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[var(--color-ink)]">
                {savedRecord.title}
              </p>
              <p className="truncate text-xs text-[var(--color-stone)]">
                {savedRecord.domain}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => router.push(`/#url-${savedRecord.id}`)}
              className="w-full sm:w-auto"
            >
              View in Library ({countdown}s)
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </GlassPanel>
      )}

      {/* Error / Manual Input State */}
      {status === "error" && (
        <GlassPanel tone="strong" className="w-full rounded-[24px] p-6 sm:p-8 animate-in fade-in duration-300">
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            Unable to Process Share
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[var(--color-slate)] sm:text-sm">
            {errorMessage || "We couldn't extract a valid URL from the share data."}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex">
              <Button variant="soft" className="w-full sm:w-auto">
                Back to Library
              </Button>
            </Link>
          </div>
        </GlassPanel>
      )}
    </div>
  );
}

export default function ShareTargetPage() {
  return (
    <main className="relative isolate flex min-h-dvh w-full flex-col items-center justify-center px-4 py-12">
      {/* Background ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, rgba(247, 215, 151, 0.45) 0%, rgba(247, 192, 151, 0.28) 45%, rgba(255, 247, 239, 0.95) 85%, #FFF7EF 100%)",
        }}
        aria-hidden
      />

      <div className="mb-6 flex items-center gap-2">
        <Link href="/" className="text-sm font-semibold tracking-tight text-[var(--color-ink)] hover:opacity-80">
          LinkNest
        </Link>
        <span className="text-[var(--color-stone)] opacity-50">•</span>
        <span className="text-xs text-[var(--color-stone)]">Mobile Share Target</span>
      </div>

      <Suspense
        fallback={
          <GlassPanel tone="strong" className="w-full max-w-lg rounded-[24px] p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--color-accent)]" />
            <p className="mt-4 text-sm text-[var(--color-slate)]">Loading share processor...</p>
          </GlassPanel>
        }
      >
        <ShareTargetProcessor />
      </Suspense>
    </main>
  );
}
