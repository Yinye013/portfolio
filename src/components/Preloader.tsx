'use client'

import { useEffect, useState } from 'react'

/**
 * Full-screen loader shown until the app is interactive.
 *
 * The styles live in an inline <style> in the root layout's <head>, not here and
 * not in globals.css — an imported stylesheet is render-blocking, so a loader
 * styled from one could not paint any earlier than the page it exists to cover.
 * The sweep is a pure CSS @keyframes for the same reason: GSAP has not parsed
 * yet at the moment this first paints.
 *
 *
 * WHEN TO REMOVE IT — window `load` vs. hydration-complete.
 *
 * Window `load` waits for every subresource: the dynamically-imported Three.js
 * chunk, the four project screenshots in /public/projects/, both Google font
 * files. Nothing pops in after the loader lifts. But it is unbounded — one slow
 * image holds the whole page hostage, and on a cold connection the hold runs
 * into seconds, which reads as a broken site rather than a polished one. It also
 * needs a fallback timeout of its own, and fires unpredictably early out of the
 * bfcache.
 *
 * Hydration-complete — this component's useEffect — fires as soon as React is
 * interactive. That is the moment the page stops being *wrong*: GSAP takes over
 * the opacity-0 Projects cards, SplitType has measured About and Contact,
 * ScrollTrigger is registered. The Hero's WebGL canvas resolves a beat later and
 * fades in on its own, which reads as intentional rather than as a missing
 * element.
 *
 * Chosen: hydration-complete. This app's problem is un-hydrated markup, not
 * unloaded images, so the loader should cover exactly that window and no longer.
 */

/** Floor on visible time. Below this the overlay comes and goes within a couple
 *  of frames on a warm cache and reads as a flicker, which is worse than never
 *  showing it at all. */
const MIN_DISPLAY_MS = 400

/** Must stay in sync with the `transition: opacity` duration on #preloader in
 *  the inline <style> in src/app/layout.tsx. */
const FADE_MS = 500

export default function Preloader() {
  // Both flags start false so the server render and the first client render
  // produce identical markup — the visible, non-hiding state. They only advance
  // inside useEffect, which never runs on the server, so there is no mismatch.
  const [hiding, setHiding] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    // Measured against actual mount time rather than a flat sleep, so the floor
    // does not stack on top of however long hydration already took.
    const elapsed = performance.now()
    let fadeTimer: ReturnType<typeof setTimeout>

    const holdTimer = setTimeout(() => {
      setHiding(true)
      fadeTimer = setTimeout(() => setGone(true), FADE_MS)
    }, Math.max(0, MIN_DISPLAY_MS - elapsed))

    return () => {
      clearTimeout(holdTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  // React owns the removal. Pulling the node out with .remove() would desync the
  // tree from the DOM and can throw on a later reconcile.
  if (gone) return null

  return (
    <div
      id="preloader"
      role="status"
      aria-live="polite"
      aria-busy={!hiding}
      // `|| undefined` keeps the attribute off the DOM entirely when false,
      // rather than rendering data-hiding="false", so the CSS selector is clean.
      data-hiding={hiding || undefined}
    >
      <div className="pl-inner" aria-hidden="true">
        <div className="pl-mark">
          OA<span className="pl-dot">.</span>
        </div>
        <div className="pl-track">
          <div className="pl-bar" />
        </div>
      </div>
      <span className="pl-sr">Loading portfolio</span>
    </div>
  )
}
