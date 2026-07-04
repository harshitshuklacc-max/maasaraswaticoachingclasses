import { getPortalUser } from "@/actions/auth";
import { readDb } from "@/lib/db";
import { redirect } from "next/navigation";

export async function requireStudent() {
  const user = await getPortalUser("student");
  if (!user) redirect("/student/login");
  const db = await readDb();
  return { user, db };
}

export async function requireTeacher() {
  const user = await getPortalUser("teacher");
  if (!user) redirect("/teacher/login");
  const db = await readDb();
  return { user, db };
}

export function getClassName(db: Awaited<ReturnType<typeof readDb>>, classId?: string) {
  return db.classes.find((c) => c.id === classId)?.name || "-";
}

export function getStudentName(db: Awaited<ReturnType<typeof readDb>>, id: string) {
  return db.users.find((u) => u.id === id)?.full_name || id;
}
