'use client'

import { useState } from 'react'

/**
 * Requests a magic link. The endpoint answers 200 unconditionally, so this
 * shows the same confirmation either way — deliberately, since anyone can reach
 * this page and it must not report whether the request actually went anywhere.
 */
export default function LoginButton() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function request() {
    setState('sending')
    try {
      await fetch('/api/dashboard/login', { method: 'POST' })
    } catch {
      // Same message either way — see above.
    }
    setState('sent')
  }

  if (state === 'sent') {
    return (
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-accent">
        Link sent — check Telegram
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={request}
      disabled={state === 'sending'}
      className="font-mono text-[11px] tracking-[0.14em] uppercase py-[10px] px-5 text-text-primary hover:text-accent disabled:opacity-50 transition-colors cursor-pointer"
      style={{ border: '0.5px solid var(--c-line)' }}
    >
      {state === 'sending' ? 'Sending…' : 'Send me a link'}
    </button>
  )
}
