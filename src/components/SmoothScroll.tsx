'use client'

import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'

// Module-level handle on the single Lenis instance. Exactly one SmoothScroll
// mounts (layout.tsx), so a singleton is honest here and saves threading a
// context through every section that needs to correct the scroll position
// after changing the document height — see src/lib/forwardPin.ts.
let lenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return lenisInstance
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const lenis = new Lenis({
      duration: isMobile ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisInstance = lenis

    let rafId = 0

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
