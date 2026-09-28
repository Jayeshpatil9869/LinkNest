"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { URL_CATEGORIES, type UrlRecord } from "@/types/url";
import { URLCardMedia } from "@/components/library/URLCardMedia";
import { URLCardMeta } from "@/components/library/URLCardMeta";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { MOTION, prefersReducedMotion } from "@/lib/motion/presets";
import { normalizeCategory } from "@/lib/url/validation";

type URLCardProps = {
  record: UrlRecord;
  onDeleted: (id: string) => void;
  highlight?: boolean;
  promoted?: boolean;
};

export function URLCard({
  record,
  onDeleted,
  highlight = false,
  promoted = false,
}: URLCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [category, setCategory] = useState<string>(record.category ?? "Reference");
  const [cover, setCover] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [savingDetails, setSavingDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const queryClient = useQueryClient();
  const articleRef = useRef<HTMLElement>(null);

  const categoryLabel = (record.category ?? "Website").toUpperCase();

  useEffect(() => {
    if (!highlight || !articleRef.current || prefersReducedMotion()) return;
    gsap.fromTo(
      articleRef.current,
      { scale: 1 },
      {
        scale: 1.015,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: MOTION.easeOut,
      },
    );
  }, [highlight]);

  const copyLink = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(record.url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy link");
    }
  };

  const bookmarkLink = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(record.url);
      setSaved(true);
      toast.success("Saved to clipboard");
      window.setTimeout(() => setSaved(false), 1600);
    } catch {
      toast.error("Could not save link");
    }
  };

  const openDetails = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCategory(record.category ?? "Reference");
    setCover("");
    setLocalPreview(null);
    setPreviewFailed(false);
    setDetailsOpen(true);
  };

  const uploadLocalImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Drop an image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8 MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return previewUrl;
    });
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? "Could not upload that image.");
      }
      setCover(payload.url);
      toast.success("Image added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload that image.");
    } finally {
      setUploading(false);
    }
  };

  const saveDetails = async () => {
    const nextCover = cover.trim();
    if (nextCover && !/^https?:\/\//i.test(nextCover)) {
      toast.error("Cover must be an http(s) image URL.");
      return;
    }

    setSavingDetails(true);
    const patch = async (body: Record<string, unknown>) => {
      const response = await fetch(`/api/urls/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      return { ok: response.ok, error: payload.error };
    };

    try {
      const body: Record<string, unknown> = {
        category: normalizeCategory(category),
      };
      if (nextCover) body.previewImage = nextCover;

      let result = await patch(body);
      if (!result.ok && nextCover && /category is not allowed/i.test(result.error ?? "")) {
        result = await patch({ previewImage: nextCover });
      }
      if (!result.ok) {
        throw new Error(result.error ?? "Could not update.");
      }

      await queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("Saved");
      setDetailsOpen(false);
      setLocalPreview(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setSavingDetails(false);
    }
  };

  const shownCover =
    localPreview ||
    cover ||
    (previewFailed ? "" : record.previewImage || "");

  const openDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmOpen(true);
  };

  const remove = async () => {
    setRemoving(true);
    try {
      const response = await fetch(`/api/urls/${record.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Removed from library");
      onDeleted(record.id);
      setConfirmOpen(false);
    } catch {
      toast.error("Could not delete this link");
      setRemoving(false);
    }
  };

  return (
    <>
      <article
        ref={articleRef}
        id={`url-${record.id}`}
        className={cn(
          "group relative transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "motion-safe:md:hover:-translate-y-1",
          highlight &&
            "rounded-[8px] ring-2 ring-black/15 ring-offset-4 ring-offset-[var(--background)]",
          removing && "scale-[0.98] opacity-0",
        )}
      >
        <div className="relative overflow-hidden rounded-[6px]">
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block outline-offset-4"
            aria-label={`Open ${record.title}`}
          >
            <URLCardMedia record={record} className="rounded-none" />

            {/* Awwwards hover: dark gradient wash */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 hidden md:block",
                "bg-[linear-gradient(180deg,rgba(20,16,12,0.15)_0%,rgba(20,16,12,0.55)_48%,rgba(12,10,8,0.88)_100%)]",
                "opacity-0 transition-opacity duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:opacity-100 group-focus-within:opacity-100",
              )}
              aria-hidden
            />

            {/* Center CTA — Open site (LinkNest equivalent of Vote Now) */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 hidden items-center justify-center md:flex",
                "opacity-0 transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:opacity-100 group-focus-within:opacity-100",
              )}
            >
              <span
                className={cn(
                  "inline-flex translate-y-2 items-center gap-2.5 rounded-[4px] bg-white px-5 py-3",
                  "text-[12px] font-semibold tracking-[0.12em] text-[#111] uppercase",
                  "shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
                  "transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover:translate-y-0 group-focus-within:translate-y-0",
                )}
              >
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                Open site
              </span>
            </div>

            {/* Bottom info bar — category + title; actions sit outside the link */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 hidden pr-28 md:block",
                "translate-y-2 opacity-0 transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:translate-y-0 group-hover:opacity-100",
                "group-focus-within:translate-y-0 group-focus-within:opacity-100",
              )}
            >
              <div className="px-3.5 pb-3.5">
                <p className="text-[10px] font-semibold tracking-[0.16em] text-white/70 uppercase">
                  {categoryLabel}
                </p>
                <h3 className="mt-1 line-clamp-2 text-[15px] leading-snug font-medium text-white">
                  {record.title}
                </h3>
              </div>
            </div>
          </a>

          {/* Right actions — Awwwards-style icon cluster */}
          <div
            className={cn(
              "absolute right-2 bottom-2.5 z-10 hidden items-center md:flex",
              "opacity-0 transition-opacity duration-[320ms]",
              "group-hover:opacity-100 group-focus-within:opacity-100",
            )}
          >
            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
              aria-label={`Open ${record.title}`}
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
              aria-label={saved ? "Saved" : "Bookmark link"}
              onClick={bookmarkLink}
            >
              {saved ? (
                <Check className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
              aria-label="Edit category and cover"
              onClick={openDetails}
            >
              <ImagePlus className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Delete link"
              onClick={openDelete}
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          {promoted ? (
            <span
              className={cn(
                "pointer-events-none absolute right-2.5 bottom-2.5 z-[1] rounded-[4px] bg-white/92 px-2 py-1",
                "text-[9px] font-semibold tracking-[0.1em] text-[#6b6b6b] uppercase",
                "shadow-[0_2px_8px_rgba(0,0,0,0.08)] backdrop-blur-sm",
                "transition-opacity duration-200 group-hover:opacity-0 group-focus-within:opacity-0",
              )}
            >
              Promoted
            </span>
          ) : null}
        </div>

        <URLCardMeta record={record} />

        <div className="mt-2 flex items-center gap-2 md:hidden">
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[6px] bg-[var(--color-ink)] px-3 text-xs font-semibold tracking-[0.06em] text-[var(--color-cloud)] uppercase"
          >
            Open
            <ArrowRight className="h-3 w-3" />
          </a>
          <button
            type="button"
            className="min-h-9 rounded-[6px] border border-black/15 px-3 text-xs font-medium text-[#333]"
            onClick={copyLink}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            className="min-h-9 rounded-[6px] border border-black/15 px-3 text-xs font-medium text-[#333]"
            onClick={openDetails}
          >
            Cover
          </button>
          <button
            type="button"
            className="min-h-9 rounded-[6px] border border-black/15 px-3 text-xs font-medium text-[#333]"
            onClick={openDelete}
          >
            Delete
          </button>
        </div>
      </article>

      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title="Remember this UI"
        description="Set a category, drop a screenshot, or paste an image URL. The card shows that image; clicking still opens the site."
      >
        <div className="space-y-3">
          <div>
            <label htmlFor={`category-${record.id}`} className="mb-1.5 block text-sm text-[var(--color-slate)]">
              Category
            </label>
            <select
              id={`category-${record.id}`}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--color-cloud)]/55 px-4 text-[var(--color-ink)]"
            >
              <option value="">Unsorted</option>
              {URL_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="mb-1.5 text-sm text-[var(--color-slate)]">Cover image</p>
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                const file = event.dataTransfer.files?.[0];
                if (file) void uploadLocalImage(file);
              }}
              className={cn(
                "relative aspect-[16/9] overflow-hidden rounded-[14px] border transition-colors",
                dragging
                  ? "border-[var(--color-ink)] bg-[var(--color-mesh-peach)]/25"
                  : "border-[var(--border)] bg-[var(--color-cloud)]/70",
              )}
            >
              {shownCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shownCover}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                  onError={() => {
                    if (!localPreview && !cover) setPreviewFailed(true);
                  }}
                />
              ) : null}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-5 text-center",
                  shownCover && "bg-[linear-gradient(180deg,transparent_30%,rgba(20,16,12,0.55)_100%)] justify-end pb-3",
                )}
              >
                {shownCover ? null : (
                  <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 text-[var(--color-ink)]">
                    <ImagePlus className="h-4 w-4" />
                  </span>
                )}
                <p className={cn("text-sm font-medium", shownCover ? "text-white" : "text-[var(--color-ink)]")}>
                  {uploading ? "Adding screenshot…" : shownCover ? "Replace screenshot" : "Drop a screenshot"}
                </p>
                {shownCover ? null : (
                  <p className="text-xs text-[var(--color-stone)]">PNG, JPG, or WEBP · up to 8 MB</p>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    "mt-1 rounded-full px-3 py-1.5 text-xs font-medium",
                    shownCover
                      ? "bg-white text-[var(--color-ink)]"
                      : "text-[var(--color-ink)] underline-offset-4 hover:underline",
                  )}
                >
                  Browse files
                </button>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadLocalImage(file);
                event.target.value = "";
              }}
            />
          </div>
          <div>
            <label htmlFor={`cover-${record.id}`} className="mb-1.5 block text-sm text-[var(--color-slate)]">
              Or paste an image URL
            </label>
            <Input
              id={`cover-${record.id}`}
              value={cover}
              onChange={(event) => setCover(event.target.value)}
              placeholder={record.previewImage ?? "https://…screenshot.png"}
              autoComplete="off"
            />
            <p className="mt-1.5 text-xs text-[var(--color-stone)]">
              Leave blank to keep the current preview.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setDetailsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void saveDetails()} disabled={savingDetails || uploading}>
              {savingDetails ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Remove from library?"
        description="This link will leave your archive. You can always add it again later."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void remove()} disabled={removing}>
            {removing ? "Removing…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
