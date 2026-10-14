import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/auth";

// Routes that require a logged-in admin session.
const PROTECTED_PAGE_PREFIXES = ["/admin/dashboard"];
const PROTECTED_API_PREFIXES = [
  "/api/qualifications",
  "/api/activities",
  "/api/projects",
  "/api/resume",
  "/api/profile",
  "/api/skills",
  "/api/upload",
];
// Reads (GET) on the API routes above are public — the portfolio page needs them.
// Only non-GET methods (POST/PUT/DELETE) are gated.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isAuthed = await verifySessionToken(token);

  const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtectedPage && !isAuthed) {
    const loginUrl = new URL("/admin", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isProtectedApi =
    PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p)) && request.method !== "GET";
  if (isProtectedApi && !isAuthed) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/qualifications/:path*", "/api/activities/:path*", "/api/projects/:path*", "/api/resume/:path*", "/api/profile/:path*", "/api/skills/:path*", "/api/upload/:path*"],
};
