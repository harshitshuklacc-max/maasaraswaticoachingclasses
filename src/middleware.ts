import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, STUDENT_COOKIE, TEACHER_COOKIE } from "@/lib/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — cookie check only
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && !request.cookies.get(ADMIN_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Student portal — local cookie auth (no Supabase in middleware)
  if (pathname.startsWith("/student") && !pathname.endsWith("/login")) {
    if (!request.cookies.get(STUDENT_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/student/login", request.url));
    }
  }

  // Teacher portal — local cookie auth
  if (pathname.startsWith("/teacher") && !pathname.endsWith("/login")) {
    if (!request.cookies.get(TEACHER_COOKIE)?.value) {
      return NextResponse.redirect(new URL("/teacher/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
  ],
};
