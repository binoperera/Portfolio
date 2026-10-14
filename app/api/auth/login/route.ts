import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { clearLoginFailures, loginBlockedFor, recordLoginFailure } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Vercel sets x-forwarded-for to the visitor's real IP (first entry).
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

    const waitSeconds = await loginBlockedFor(ip);
    if (waitSeconds > 0) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${Math.ceil(waitSeconds / 60)} min.` },
        { status: 429, headers: { "Retry-After": String(waitSeconds) } }
      );
    }

    const { password } = await request.json();

    if (!password || !(await checkPassword(password))) {
      await recordLoginFailure(ip);
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    await clearLoginFailures(ip);

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Login failed." },
      { status: 500 }
    );
  }
}
