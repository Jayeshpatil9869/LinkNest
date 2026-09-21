"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { UrlRecord } from "@/types/url";
import { URLCardMedia } from "@/components/library/URLCardMedia";
import { URLCardMeta } from "@/components/library/URLCardMeta";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { MOTION, prefersReducedMotion } from "@/lib/motion/presets";

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
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removing, setRemoving] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const category = (record.category ?? "Website").toUpperCase();

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
                  {category}
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
            onClick={openDelete}
          >
            Delete
          </button>
        </div>
      </article>

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
