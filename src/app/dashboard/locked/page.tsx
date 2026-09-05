import type { Metadata } from 'next'
import LoginButton from './LoginButton'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

/**
 * What an unauthenticated visitor to /dashboard actually sees. The middleware
 * rewrites here rather than redirecting, so the URL still reads /dashboard.
 */
export default async function LockedPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: string }>
}) {
  const { expired } = await searchParams

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-text-faint">
          Restricted
        </span>
        <h1 className="font-display text-[36px] tracking-[0.04em] leading-none text-text-primary">
          Visitor <span className="text-accent">dashboard.</span>
        </h1>
        <p className="text-xs text-text-muted max-w-[38ch] leading-[1.7]">
          {expired
            ? 'That link has expired or was already used. Request a new one.'
            : 'Access is confirmed over Telegram. Request a link to sign in.'}
        </p>
        <LoginButton />
      </div>
    </main>
  )
}
