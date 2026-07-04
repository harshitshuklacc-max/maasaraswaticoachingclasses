"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { ADMIN_COOKIE, STUDENT_COOKIE, TEACHER_COOKIE } from "@/lib/cookies";
import { usernameToEmail } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginWithUsername(
  username: string,
  password: string,
  portal: "admin" | "student" | "teacher"
) {
  if (portal === "admin") {
    const adminUser = process.env.ADMIN_USERNAME || "MScc1245879";
    const adminPass = process.env.ADMIN_PASSWORD || "MsEc@3123";
    if (username === adminUser && password === adminPass) {
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_COOKIE, "authenticated", {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/",
      });
      return { success: true as const };
    }
    return { success: false as const, error: "Invalid admin credentials" };
  }

  const supabase = createServiceClientSafe();
  if (supabase) {
    const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
    if (!profile) return { success: false as const, error: "Invalid username or password" };
    const expected = portal === "student" ? "student" : "teacher";
    if (profile.role !== expected) return { success: false as const, error: "Access denied" };
    const client = await createClient();
    const { error } = await client.auth.signInWithPassword({
      email: profile.email || usernameToEmail(username),
      password,
    });
    if (error) return { success: false as const, error: "Invalid username or password" };
    return { success: true as const };
  }

  const db = await readDb();
  const user = db.users.find((u) => u.username === username && u.password === password);
  if (!user || user.role !== portal) {
    return { success: false as const, error: "Invalid username or password" };
  }
  const cookieStore = await cookies();
  const cookieName = portal === "student" ? STUDENT_COOKIE : TEACHER_COOKIE;
  cookieStore.set(cookieName, user.id, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 604800, path: "/",
  });
  return { success: true as const };
}

function createServiceClientSafe() {
  try { return createServiceClient(); } catch { return null; }
}

export async function logout(portal: "admin" | "student" | "teacher") {
  const cookieStore = await cookies();
  if (portal === "admin") cookieStore.delete(ADMIN_COOKIE);
  else if (portal === "student") {
    cookieStore.delete(STUDENT_COOKIE);
    try { const c = await createClient(); await c.auth.signOut(); } catch { /* ok */ }
    redirect("/student/login");
  } else {
    cookieStore.delete(TEACHER_COOKIE);
    try { const c = await createClient(); await c.auth.signOut(); } catch { /* ok */ }
    redirect("/teacher/login");
  }
  redirect(`/${portal}/login`);
}

export async function getPortalUser(portal: "student" | "teacher") {
  const cookieStore = await cookies();
  const cookieName = portal === "student" ? STUDENT_COOKIE : TEACHER_COOKIE;
  const userId = cookieStore.get(cookieName)?.value;
  if (!userId) return null;
  const db = await readDb();
  return db.users.find((u) => u.id === userId && u.role === portal) || null;
}
