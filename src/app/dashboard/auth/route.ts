import { NextResponse } from "next/server";
import { sha256 } from "@/lib/request";
import { getRedis, KEYS } from "@/lib/redis";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/session";

/**
 * Consumes a dashboard magic link and issues the session cookie.
 *
 * Exempted from the proxy guard (see src/proxy.ts) — this is the route that
 * creates the thing the guard checks for.
 *
 * A route handler rather than a page so the cookie is set on a real redirect
 * response, which also gets the token out of the address bar immediately.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t");
  const home = new URL("/dashboard", req.url);
  const denied = new URL("/dashboard/locked?expired=1", req.url);

  if (!token) return NextResponse.redirect(denied);

  const redis = getRedis();
  if (!redis) {
    console.error("[dashboard/auth] Redis is not configured");
    return NextResponse.redirect(denied);
  }

  // GETDEL, so a link works exactly once. A plain GET followed by a DEL would
  // leave a window where two people could both redeem the same token.
  const claimed = await redis.getdel(KEYS.dashToken(await sha256(token)));
  if (claimed === null) return NextResponse.redirect(denied);

  const cookie = await signSession(Date.now() + SESSION_MAX_AGE * 1000);
  if (!cookie) return NextResponse.redirect(denied);

  const res = NextResponse.redirect(home);
  res.cookies.set(SESSION_COOKIE, cookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
