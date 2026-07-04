"use server";

import { revalidatePath } from "next/cache";
import { readDb, writeDb, uid, type DbSchema } from "@/lib/db";
import { saveGalleryFile } from "@/lib/gallery";
import { createServiceClientSafe } from "@/lib/supabase/admin";

export type GalleryUploadState = { success?: boolean; error?: string } | null;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/admissions");
}

export async function submitAdmission(data: {
  student_name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  desired_class?: string;
  message?: string;
}) {
  const supabase = createServiceClientSafe();
  if (supabase) {
    const { error } = await supabase.from("admissions").insert({ ...data, status: "pending" });
    if (error) return { success: false, error: error.message };
  } else {
    await writeDb((db) => ({
      ...db,
      admissions: [
        { id: uid(), ...data, status: "pending" as const, created_at: new Date().toISOString() },
        ...db.admissions,
      ],
    }));
  }
  revalidateAll();
  return { success: true };
}

export async function updateAdmissionStatus(id: string, status: string) {
  const supabase = createServiceClientSafe();
  if (supabase) {
    const { error } = await supabase.from("admissions").update({ status }).eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    await writeDb((db) => ({
      ...db,
      admissions: db.admissions.map((a) => (a.id === id ? { ...a, status: status as typeof a.status } : a)),
    }));
  }
  revalidatePath("/admin/admissions");
  return { success: true };
}

export async function deleteRecord(collection: keyof DbSchema, id: string) {
  await writeDb((db) => ({
    ...db,
    [collection]: (db[collection] as { id: string }[]).filter((item) => item.id !== id),
  }));
  revalidatePath("/admin");
  return { success: true };
}

export async function createRecord(collection: keyof DbSchema, data: Record<string, unknown>) {
  const record = { id: uid(), created_at: new Date().toISOString(), ...data };
  await writeDb((db) => ({
    ...db,
    [collection]: [record, ...(db[collection] as object[])],
  }));
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true, data: record };
}

export async function recordFeePayment(data: {
  fee_record_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  receipt_number?: string;
}) {
  await writeDb((db) => {
    const payments = [{ id: uid(), ...data, payment_method: data.payment_method || "cash" }, ...db.fee_payments];
    const fee_records = db.fee_records.map((f) =>
      f.id === data.fee_record_id ? { ...f, paid_amount: f.paid_amount + data.amount } : f
    );
    return { ...db, fee_payments: payments, fee_records };
  });
  revalidatePath("/admin/fees");
  revalidatePath("/student/fees");
  return { success: true };
}

export async function uploadGalleryPhoto(
  _prev: GalleryUploadState,
  formData: FormData
): Promise<GalleryUploadState> {
  try {
    const file = formData.get("photo");
    if (!(file instanceof File)) {
      return { success: false, error: "Please select a photo to upload" };
    }

    const title = ((formData.get("title") as string) || "").trim();
    const category = (formData.get("category") as string) || "building";

    await saveGalleryFile(file, title, category);

    revalidatePath("/");
    revalidatePath("/admin/gallery");
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return { success: false, error: message };
  }
}

export async function deleteGalleryPhoto(id: string) {
  const db = await readDb();
  const item = db.gallery.find((g) => g.id === id);

  if (item?.image_url.startsWith("/uploads/")) {
    try {
      const { unlink } = await import("fs/promises");
      const pathMod = await import("path");
      await unlink(pathMod.join(process.cwd(), "public", item.image_url));
    } catch {
      /* file may already be removed */
    }
  }

  await deleteRecord("gallery", id);
  revalidatePath("/");
  revalidatePath("/admin/gallery");
  return { success: true };
}

export async function getDashboardStats() {
  const db = await readDb();
  return {
    students: db.users.filter((u) => u.role === "student").length,
    teachers: db.users.filter((u) => u.role === "teacher").length,
    classes: db.classes.length,
    pendingAdmissions: db.admissions.filter((a) => a.status === "pending").length,
  };
}

export async function createUser(data: {
  username: string;
  password: string;
  full_name: string;
  role: "student" | "teacher";
  phone?: string;
  class_id?: string;
  section_id?: string;
  admission_number?: string;
  parent_name?: string;
  parent_phone?: string;
}) {
  const db = await readDb();
  if (db.users.some((u) => u.username === data.username)) {
    return { success: false, error: "Username already exists" };
  }
  await writeDb((d) => ({ ...d, users: [{ id: uid(), ...data }, ...d.users] }));
  revalidatePath("/admin/students");
  revalidatePath("/admin/teachers");
  return { success: true };
}
