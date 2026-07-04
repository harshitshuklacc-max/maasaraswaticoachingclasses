import { promises as fs } from "fs";
import path from "path";
import { writeDb, uid } from "@/lib/db";

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const ALLOWED_MIME = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 5 * 1024 * 1024;

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
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

export async function saveGalleryFile(file: File, title: string, category: string) {
  const validationError = validateGalleryFile(file);
  if (validationError) throw new Error(validationError);

  const ext = fileExtension(file.name) || "jpg";
  const filename = `${uid()}.${ext === "jpeg" ? "jpg" : ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");

  await fs.mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const image_url = `/uploads/gallery/${filename}`;
  const id = uid();

  await writeDb((db) => ({
    ...db,
    gallery: [{ id, title, category, image_url }, ...db.gallery],
  }));

  return { id, title, category, image_url };
}
