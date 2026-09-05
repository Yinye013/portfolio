import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/session'

/**
 * Guards the visitor dashboard.
 *
 * A rewrite rather than a redirect, so the URL stays /dashboard and the locked
 * page is not a route anyone lands on directly or can bookmark by accident.
 *
 * /dashboard/auth is exempt: it is the magic-link consumer, and it is what sets
 * the cookie this check is looking for.
 */
export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/dashboard/auth')) return NextResponse.next()

  const authorised = await verifySession(req.cookies.get(SESSION_COOKIE)?.value)
  if (authorised) return NextResponse.next()

  // Carry the query across: /dashboard/auth redirects here with ?expired=1 to
  // explain why, and a bare rewrite would drop it.
  const locked = new URL('/dashboard/locked', req.url)
  locked.search = req.nextUrl.search
  return NextResponse.rewrite(locked)
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
