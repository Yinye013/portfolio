'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { gsap } from '@/lib/gsap'

/**
 * Sun/moon switch for the navbar.
 *
 * The icons are stacked in one box and cross-faded on a short rotation so the
 * swap reads as a single element turning over rather than two icons swapping.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const sunRef = useRef<SVGSVGElement>(null)
  const moonRef = useRef<SVGSVGElement>(null)

  // The server cannot know the visitor's theme, so `resolvedTheme` is undefined
  // until next-themes reads it on the client. Both icons stay hidden until then,
  // which keeps the markup identical on both sides of hydration.
  const mounted = resolvedTheme !== undefined
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    if (!mounted) return
    const sun = sunRef.current
    const moon = moonRef.current
    if (!sun || !moon) return

    gsap.to(sun, {
      opacity: isDark ? 0 : 1,
      rotate: isDark ? -90 : 0,
      scale: isDark ? 0.5 : 1,
      duration: 0.35,
      ease: 'power2.out',
    })
    gsap.to(moon, {
      opacity: isDark ? 1 : 0,
      rotate: isDark ? 0 : 90,
      scale: isDark ? 1 : 0.5,
      duration: 0.35,
      ease: 'power2.out',
    })
  }, [isDark, mounted])

  // Before hydration the active theme is unknown, so the control is announced
  // neutrally rather than claiming a direction it might have backwards.
  const label = mounted
    ? isDark
      ? 'Switch to light mode'
      : 'Switch to dark mode'
    : 'Toggle theme'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
      className={`relative grid place-items-center w-[30px] h-[30px] shrink-0 cursor-pointer border-[0.5px] border-border text-text-nav hover:text-accent hover:border-accent-border transition-colors duration-150 ${className}`}
    >
      <svg
        ref={sunRef}
        className="col-start-1 row-start-1"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        aria-hidden="true"
        style={{ opacity: mounted && !isDark ? 1 : 0 }}
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
      </svg>

      <svg
        ref={moonRef}
        className="col-start-1 row-start-1"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
        style={{ opacity: mounted && isDark ? 1 : 0 }}
      >
        <path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1Z" />
      </svg>
    </button>
  )
}
