"use strict";

const { getSupabase } = require("../lib/supabase");
const { extractDomain, normalizeUrl } = require("../lib/normalize");
const {
  recordToInsert,
  resolvePreviewImage,
  rowToRecord,
} = require("../lib/mapUrl");
const { fetchUrlMetadata } = require("../lib/metadata");
const {
  createUrlSchema,
  normalizeCategory,
  previewRequestSchema,
  updateUrlSchema,
} = require("../lib/validation");

async function urlsRoutes(fastify) {
  fastify.get("/urls", async (_request, reply) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      requestLog(fastify, error);
      return reply.code(500).send({ error: "Failed to list urls." });
    }

    return { urls: (data ?? []).map(rowToRecord) };
  });

  fastify.get("/urls/:id", async (request, reply) => {
    const { id } = request.params;
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      requestLog(fastify, error);
      return reply.code(500).send({ error: "Failed to fetch url." });
    }
    if (!data) {
      return reply.code(404).send({ error: "Not found." });
    }
    return rowToRecord(data);
  });

  fastify.post("/urls", async (request, reply) => {
    const parsed = createUrlSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      });
    }

    const body = parsed.data;
    const normalized = normalizeUrl(body.url);
    const supabase = getSupabase();

    const existing = await findByNormalized(supabase, normalized);
    if (existing) {
      return reply.code(409).send({ code: "duplicate", url: existing });
    }

    const domain = extractDomain(body.url);
    const insert = recordToInsert({
      url: body.url.trim(),
      normalizedUrl: normalized,
      title: body.title?.trim() || domain,
      description: body.description?.trim() || null,
      domain,
      faviconUrl:
        body.faviconUrl ??
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      previewImage: resolvePreviewImage(body.url, body.previewImage),
      category: normalizeCategory(body.category),
      tags: body.tags ?? [],
    });

    const { data, error } = await supabase
      .from("urls")
      .insert(insert)
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        const dupe = await findByNormalized(supabase, normalized);
        if (dupe) {
          return reply.code(409).send({ code: "duplicate", url: dupe });
        }
      }
      if (error.code === "23514") {
        return reply.code(400).send({
          error:
            "This category is not allowed yet. Run backend/sql/2026-09-28-reference-category.sql in Supabase.",
        });
      }
      requestLog(fastify, error);
      return reply.code(500).send({ error: "Failed to create url." });
    }

    return reply.code(201).send(rowToRecord(data));
  });

  fastify.patch("/urls/:id", async (request, reply) => {
    const parsed = updateUrlSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: parsed.error.issues[0]?.message ?? "Invalid input.",
      });
    }

    const { id } = request.params;
    const patch = { updated_at: new Date().toISOString() };
    if (parsed.data.category !== undefined) {
      patch.category = normalizeCategory(parsed.data.category);
    }
    if (parsed.data.previewImage !== undefined) {
      patch.preview_image = parsed.data.previewImage;
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("urls")
      .update(patch)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      requestLog(fastify, error);
      if (error.code === "23514") {
        return reply.code(400).send({
          error:
            "This category is not allowed yet. Run backend/sql/2026-09-28-reference-category.sql in Supabase.",
        });
      }
      return reply.code(500).send({ error: "Failed to update url." });
    }
    if (!data) {
      return reply.code(404).send({ error: "Not found." });
    }
    return rowToRecord(data);
  });

  fastify.delete("/urls/:id", async (request, reply) => {
    const { id } = request.params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("urls")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      requestLog(fastify, error);
      return reply.code(500).send({ error: "Failed to delete url." });
    }
    if (!data) {
      return reply.code(404).send({ error: "Not found." });
    }
    return reply.code(204).send();
  });

  fastify.post("/urls/preview", async (request, reply) => {
    const parsed = previewRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: parsed.error.issues[0]?.message ?? "Invalid URL.",
      });
    }

    const normalizedUrl = normalizeUrl(parsed.data.url);
    const supabase = getSupabase();
    const existing = await findByNormalized(supabase, normalizedUrl);
    if (existing) {
      return reply.code(409).send({ code: "duplicate", url: existing });
    }

    const preview = await fetchUrlMetadata(parsed.data.url);
    return preview;
  });
}

async function findByNormalized(supabase, normalizedUrl) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("normalized_url", normalizedUrl)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToRecord(data) : null;
}

function requestLog(fastify, error) {
  fastify.log.error(
    {
      message: error.message,
      code: error.code,
    },
    "urls route error",
  );
}

module.exports = urlsRoutes;
