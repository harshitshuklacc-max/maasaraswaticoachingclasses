import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/cookies";

export { ADMIN_COOKIE };

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return profile ? { user, profile } : null;
}

export async function requireRole(roles: UserRole[]) {
  const session = await getSessionUser();
  if (!session || !roles.includes(session.profile.role)) return null;
  return session;
}

export async function isAdminSession() {
  const cookieStore = await cookies();
  return !!cookieStore.get(ADMIN_COOKIE)?.value;
}

export function usernameToEmail(username: string) {
  return `${username.toLowerCase()}@mscc.internal`;
}
