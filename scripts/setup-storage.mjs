import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = readFileSync(resolve(root, ".env.local"), "utf8");
for (const line of env.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data: buckets, error } = await supabase.storage.listBuckets();
if (error) {
  console.error("listBuckets:", error.message);
  process.exit(1);
}

const uploads = buckets.find((b) => b.name === "uploads");
if (uploads) {
  console.log("uploads bucket: OK (public:", uploads.public, ")");
} else {
  const { error: createError } = await supabase.storage.createBucket("uploads", { public: true });
  console.log(createError ? `uploads bucket: FAILED - ${createError.message}` : "uploads bucket: CREATED");
}
