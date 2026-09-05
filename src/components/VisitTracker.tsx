'use client'

import { useEffect } from 'react'

/**
 * Fires one beacon at /api/visit per browser tab.
 *
 * The sessionStorage guard is doing two jobs: it keeps an in-tab re-render or a
 * client-side navigation from re-announcing the same person, and it absorbs
 * React StrictMode's deliberate double-effect in development. The server has
 * its own dedupe window on top of this, since sessionStorage is per-tab and
 * cleared readily.
 *
 * Renders nothing. Everything it sends is already available to the server
 * except the screen size and the timezone, which are what make the notification
 * read like a person rather than a log line.
 */

const SESSION_KEY = 'visit-tracked'

export default function VisitTracker() {
  useEffect(() => {
    // The owner reading their own dashboard is not a visit.
    if (window.location.pathname.startsWith('/dashboard')) return

    let alreadyTracked = false
    try {
      alreadyTracked = sessionStorage.getItem(SESSION_KEY) === '1'
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // Private mode, or storage blocked. The server-side dedupe still holds,
      // so proceeding is safe — losing the visit entirely would be worse.
    }
    if (alreadyTracked) return

    const payload = {
      path: window.location.pathname,
      referrer: document.referrer || 'direct',
      screen: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    // keepalive so the request survives the visitor navigating away immediately.
    // The catch is not optional: an ad blocker rejecting this must not surface
    // as an unhandled rejection in a visitor's console.
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {})
  }, [])

  return null
}
