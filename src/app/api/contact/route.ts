import { NextResponse } from 'next/server'
import { Resend } from 'resend'

/**
 * Contact form endpoint.
 *
 * The Resend client is constructed per-request rather than at module scope: at
 * build time RESEND_API_KEY is absent, and the constructor throws on a missing
 * key, which would fail `next build` rather than this one request.
 */

/** Deliberately loose — a full RFC 5322 regex rejects addresses that work. This
 *  only catches obvious typos; Resend is the real validator. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LIMITS = { name: 100, email: 254, message: 5000 } as const

/*
 * Rate limiting: a fixed window per client IP, held in module scope.
 *
 * Deliberately dependency-free. The state lives in one server instance's
 * memory, so on serverless it resets on a cold start and is not shared between
 * concurrent instances — an attacker spread across instances gets more than
 * MAX_REQUESTS through. That is an accepted tradeoff here: this stops the
 * realistic threat (one script hammering the endpoint to flood the inbox)
 * without an external service. If this ever needs a hard guarantee, swap this
 * block for @upstash/ratelimit backed by Redis; nothing else has to change.
 */
const WINDOW_MS = 60 * 60 * 1000 // 1 hour
const MAX_REQUESTS = 5           // per IP per window

type Hits = { count: number; resetAt: number }
const hits = new Map<string, Hits>()

/** Bounds the Map so a flood of unique IPs cannot grow it without limit. */
const MAX_TRACKED_IPS = 10_000

function clientIp(req: Request): string {
  // Vercel and most proxies set x-forwarded-for; the client's address is the
  // first entry. Trusting a header is only safe behind a proxy that overwrites
  // it, which is the case on Vercel. Falls back to a shared bucket rather than
  // failing open per-request.
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

/** Returns null when allowed, or the seconds to wait when limited. */
function rateLimit(ip: string): number | null {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now >= entry.resetAt) {
    if (hits.size >= MAX_TRACKED_IPS) {
      // Drop whatever has already expired before admitting a new key.
      for (const [key, value] of hits) if (now >= value.resetAt) hits.delete(key)
    }
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return null
  }

  if (entry.count >= MAX_REQUESTS) {
    return Math.ceil((entry.resetAt - now) / 1000)
  }

  entry.count += 1
  return null
}

/** The payload is interpolated into an HTML email, so every field has to be
 *  escaped or a submitted `<script>`/`<img onerror>` lands in the inbox. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  // Checked first: a limited caller should cost nothing beyond a Map lookup.
  const retryAfter = rateLimit(clientIp(req))
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: 'Too many messages sent. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL

  if (!apiKey || !recipient) {
    // A config problem, not a caller problem — log it here, stay vague outward.
    console.error('[contact] RESEND_API_KEY or CONTACT_RECIPIENT_EMAIL is not set')
    return NextResponse.json({ error: 'Email is not configured.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, message } = (body ?? {}) as Record<string, unknown>

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const trimmed = { name: name.trim(), email: email.trim(), message: message.trim() }

  if (!trimmed.name || !trimmed.email || !trimmed.message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(trimmed.email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  for (const [field, max] of Object.entries(LIMITS)) {
    if (trimmed[field as keyof typeof trimmed].length > max) {
      return NextResponse.json({ error: `${field} is too long.` }, { status: 400 })
    }
  }

  const safe = {
    name: escapeHtml(trimmed.name),
    email: escapeHtml(trimmed.email),
    message: escapeHtml(trimmed.message).replace(/\r?\n/g, '<br>'),
  }

  try {
    const { data, error } = await resendClient(apiKey).emails.send({
      // Until a domain is verified in Resend, this must stay onboarding@resend.dev
      // and can then only deliver to the account's own address.
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [recipient],
      replyTo: trimmed.email,
      subject: `New portfolio message from ${trimmed.name}`,
      html: `
        <h3>New contact form submission</h3>
        <p><strong>Name:</strong> ${safe.name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Message:</strong></p>
        <p>${safe.message}</p>
      `,
    })

    // The SDK reports delivery failures in `error` rather than by throwing.
    if (error) {
      console.error('[contact] resend returned an error', error)
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 502 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    console.error('[contact] unexpected failure', err)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}

function resendClient(apiKey: string) {
  return new Resend(apiKey)
}
