import { promises as fs } from "fs";
import path from "path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { writeDb, uid } from "@/lib/db";
import { createServiceClientSafe } from "@/lib/supabase/admin";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "uploads";

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

/** True on Vercel, Lambda, Netlify, etc. — filesystem is read-only. */
export function isServerlessEnv() {
  const cwd = process.cwd();
  return Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.NETLIFY ||
    cwd.startsWith("/var/task") ||
    cwd.includes("\\var\\task")
  );
}

function gallerySetupHint() {
  return 'Run supabase/migrations/002_gallery_storage.sql in Supabase SQL Editor, then redeploy.';
}

function mapSupabaseError(message: string) {
  if (message.includes("gallery") || message.includes("schema cache")) {
    return `Gallery table not found in Supabase. ${gallerySetupHint()}`;
  }
  if (message.includes("Bucket not found")) {
    return `Storage bucket "uploads" not found. ${gallerySetupHint()}`;
  }
  return message;
}

export function validateGalleryFile(file: File) {
  if (!file || file.size === 0) {
    return "Please select a photo to upload";
  }
  const ext = fileExtension(file.name);
  const mimeOk = !file.type || ALLOWED_MIME.has(file.type);
  const extOk = ALLOWED_EXT.has(ext);
  if (!mimeOk && !extOk) {
    return "Only JPG, PNG, WEBP or GIF images are allowed";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be under 5MB";
  }
  return null;
}

async function saveGalleryLocally(
  title: string,
  category: string,
  buffer: Buffer,
  filename: string
) {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const image_url = `/uploads/gallery/${filename}`;
  const id = uid();

  await writeDb((db) => ({
    ...db,
    gallery: [{ id, title, category, image_url }, ...db.gallery],
  }));

  return { id, title, category, image_url };
}

async function saveGalleryToSupabase(
  supabase: SupabaseClient,
  title: string,
  category: string,
  buffer: Buffer,
  filename: string,
  contentType: string
) {
  const storagePath = `gallery/${filename}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: false,
  });
  if (uploadError) {
    throw new Error(mapSupabaseError(`Storage upload failed: ${uploadError.message}`));
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const image_url = publicUrl.publicUrl;

  const { data, error } = await supabase
    .from("gallery")
    .insert({ title, category, image_url, is_active: true })
    .select("id")
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(mapSupabaseError(error.message));
  }

  return { id: data.id as string, title, category, image_url };
}

export async function saveGalleryFile(file: File, title: string, category: string) {
  const validationError = validateGalleryFile(file);
  if (validationError) throw new Error(validationError);

  const ext = fileExtension(file.name) || "jpg";
  const filename = `${uid()}.${ext === "jpeg" ? "jpg" : ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || `image/${ext === "jpg" ? "jpeg" : ext}`;

  const supabase = createServiceClientSafe();
  const serverless = isServerlessEnv();

  // Production/serverless: Supabase only — never touch local disk
  if (serverless) {
    if (!supabase) {
      throw new Error(
        "Gallery uploads on Vercel require Supabase env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY"
      );
    }
    return saveGalleryToSupabase(supabase, title, category, buffer, filename, contentType);
  }

  // Local dev with Supabase configured: use Supabase (no silent fallback to disk)
  if (supabase) {
    return saveGalleryToSupabase(supabase, title, category, buffer, filename, contentType);
  }

  // Local dev without Supabase: save to public/uploads
  return saveGalleryLocally(title, category, buffer, filename);
}

export async function deleteGalleryItem(id: string, imageUrl?: string) {
  const supabase = createServiceClientSafe();

  if (imageUrl?.includes("/storage/v1/object/public/uploads/")) {
    const marker = "/storage/v1/object/public/uploads/";
    const storagePath = imageUrl.split(marker)[1];
    if (supabase && storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }
  } else if (imageUrl?.startsWith("/uploads/") && !isServerlessEnv()) {
    try {
      await fs.unlink(path.join(process.cwd(), "public", imageUrl));
    } catch {
      /* file may already be removed */
    }
  }

  if (supabase) {
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) return;
  }

  if (!isServerlessEnv()) {
    await writeDb((db) => ({
      ...db,
      gallery: db.gallery.filter((g) => g.id !== id),
    }));
  }
}
