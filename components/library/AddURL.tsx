"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { URLCardFallback } from "@/components/library/URLCardFallback";
import {
  createUrlSchema,
  normalizeCategory,
  type CreateUrlFormValues,
} from "@/lib/url/validation";
import { URL_CATEGORIES, type UrlPreview, type UrlRecord } from "@/types/url";

type AddURLProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (record: UrlRecord) => void;
  onDuplicate: (record: UrlRecord) => void;
  initialUrl?: string;
  /** When true (hero Enter), preview then save without extra clicks */
  autoSubmit?: boolean;
};

type FlowState =
  | "idle"
  | "analyzing"
  | "preview"
  | "duplicate"
  | "saving"
  | "error";

export function AddURL({
  open,
  onClose,
  onSaved,
  onDuplicate,
  initialUrl = "",
  autoSubmit = false,
}: AddURLProps) {
  const queryClient = useQueryClient();
  const [flow, setFlow] = useState<FlowState>("idle");
  const [preview, setPreview] = useState<UrlPreview | null>(null);
  const [duplicate, setDuplicate] = useState<UrlRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const autoRanRef = useRef(false);

  const form = useForm<CreateUrlFormValues>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      category: null,
      tags: [],
    },
  });

  const savePreview = async (data: UrlPreview, values?: CreateUrlFormValues) => {
    setFlow("saving");
    const formValues = values ?? form.getValues();

    try {
      const response = await fetch("/api/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url,
          title: formValues.title || data.title,
          description: formValues.description || data.description,
          category: normalizeCategory(formValues.category),
          faviconUrl: data.faviconUrl,
          previewImage: data.previewImage,
        }),
      });

      if (response.status === 409) {
        const payload = (await response.json()) as {
          code: string;
          url: UrlRecord;
        };
        setDuplicate(payload.url);
        setFlow("duplicate");
        return;
      }

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not save.");
      }

      const record = (await response.json()) as UrlRecord;
      await queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("Saved to library");
      onSaved(record);
      onClose();
    } catch (err) {
      setFlow("error");
      setError(err instanceof Error ? err.message : "Could not save.");
    }
  };

  const analyzeUrl = async (rawUrl: string, shouldAutoSave: boolean) => {
    setFlow("analyzing");
    setError(null);
    setDuplicate(null);

    try {
      const response = await fetch("/api/urls/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      });

      if (response.status === 409) {
        const data = (await response.json()) as {
          code: string;
          url: UrlRecord;
        };
        setDuplicate(data.url);
        setFlow("duplicate");
        return;
      }

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Could not analyze this URL.");
      }

      const data = (await response.json()) as UrlPreview;
      setPreview(data);
      form.setValue("title", data.title);
      form.setValue("description", data.description ?? "");
      form.setValue("url", data.url);

      if (shouldAutoSave) {
        await savePreview(data, {
          url: data.url,
          title: data.title,
          description: data.description ?? "",
          category: null,
          tags: [],
        });
        return;
      }

      setFlow("preview");
    } catch (err) {
      setFlow("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  useEffect(() => {
    if (!open) {
      setFlow("idle");
      setPreview(null);
      setDuplicate(null);
      setError(null);
      autoRanRef.current = false;
      form.reset();
      return;
    }

    const seed = initialUrl.trim();
    if (!seed) return;
    if (autoRanRef.current) return;
    autoRanRef.current = true;

    form.reset({
      url: seed,
      title: "",
      description: "",
      category: null,
      tags: [],
    });
    void analyzeUrl(seed, autoSubmit);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per open+seed
  }, [open, initialUrl, autoSubmit]);

  const save = async () => {
    if (!preview) return;
    await savePreview(preview);
  };

  const compact = autoSubmit && (flow === "analyzing" || flow === "saving");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={compact ? "Adding link" : "Add to library"}
      description={
        compact
          ? "Fetching details and saving to your archive…"
          : "Paste a URL worth remembering."
      }
      className="max-h-[min(82vh,560px)] max-w-[min(100%,420px)] overflow-y-auto"
    >
      {flow === "duplicate" && duplicate ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--color-slate)]">
            This link is already in your library.
          </p>
          <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
            <div className="aspect-[16/9]">
              <URLCardFallback record={duplicate} />
            </div>
            <div className="p-3">
              <p className="text-xs text-[var(--color-stone)]">{duplicate.domain}</p>
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {duplicate.title}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDuplicate(duplicate);
                onClose();
              }}
            >
              View existing
            </Button>
          </div>
        </div>
      ) : compact ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div
            className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--color-fog)] border-t-[var(--color-ink)]"
            aria-hidden
          />
          <p className="text-sm text-[var(--color-slate)]">
            {flow === "saving" ? "Saving to library…" : "Reading page details…"}
          </p>
        </div>
      ) : (
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => {
            if (flow === "preview") {
              void save();
            } else {
              void analyzeUrl(values.url, false);
            }
          })}
        >
          <div>
            <label htmlFor="url" className="mb-1.5 block text-sm text-[var(--color-slate)]">
              URL
            </label>
            <Input
              id="url"
              placeholder="https://"
              autoComplete="url"
              {...form.register("url")}
            />
            {form.formState.errors.url ? (
              <p className="mt-1.5 text-sm text-[var(--color-slate)]">
                {form.formState.errors.url.message}
              </p>
            ) : null}
          </div>

          {flow === "analyzing" ? (
            <p className="text-sm text-[var(--color-stone)]">Reading page details…</p>
          ) : null}

          {flow === "preview" && preview ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-[12px] border border-[var(--border)]">
                <div className="aspect-[16/9] max-h-36">
                  {preview.previewImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview.previewImage}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <URLCardFallback
                      record={{
                        domain: preview.domain,
                        title: preview.title,
                        faviconUrl: preview.faviconUrl,
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm text-[var(--color-slate)]">
                  Title
                </label>
                <Input id="title" {...form.register("title")} />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm text-[var(--color-slate)]"
                >
                  Description
                </label>
                <Input id="description" {...form.register("description")} />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm text-[var(--color-slate)]"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="min-h-11 w-full rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--color-cloud)]/55 px-4 text-[var(--color-ink)]"
                  {...form.register("category")}
                >
                  <option value="">Unsorted</option>
                  {URL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-[var(--color-slate)]" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={flow === "analyzing" || flow === "saving"}>
              {flow === "saving"
                ? "Saving…"
                : flow === "preview"
                  ? "Save to library"
                  : flow === "analyzing"
                    ? "Reading…"
                    : "Preview"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
