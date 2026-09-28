"use strict";

const { getSupabase } = require("../lib/supabase");

const BUCKET = "link-covers";
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function ensureBucket(supabase) {
  const existing = await supabase.storage.getBucket(BUCKET);
  if (existing.data) return;
  const created = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 8 * 1024 * 1024,
    allowedMimeTypes: [...ALLOWED],
  });
  if (created.error && !/already exists/i.test(created.error.message)) {
    throw created.error;
  }
}

async function uploadRoutes(fastify) {
  fastify.post("/uploads", async (request, reply) => {
    const file = await request.file();
    if (!file) {
      return reply.code(400).send({ error: "Choose an image." });
    }
    if (!ALLOWED.has(file.mimetype)) {
      return reply.code(400).send({ error: "Use a PNG, JPG, WEBP, or GIF." });
    }

    const buffer = await file.toBuffer();
    const ext =
      file.mimetype === "image/png"
        ? "png"
        : file.mimetype === "image/webp"
          ? "webp"
          : file.mimetype === "image/gif"
            ? "gif"
            : "jpg";
    const objectPath = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const supabase = getSupabase();
    await ensureBucket(supabase);

    const uploaded = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
      contentType: file.mimetype,
      upsert: false,
    });
    if (uploaded.error) {
      fastify.log.error(
        { message: uploaded.error.message },
        "cover upload failed",
      );
      return reply.code(500).send({ error: "Could not store that image." });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    return { url: data.publicUrl };
  });
}

module.exports = uploadRoutes;
