'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const items = [
  'Next.js', 'React', 'Vue', 'Nuxt.js', 'Angular', 'Node.js', 'NestJS',
  'Spring Boot', 'Java', 'TypeScript', 'GSAP', 'Contentful', 'SASS', 'TailwindCSS',
] as const

const doubled = [...items, ...items]

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    tweenRef.current = gsap.to(track, {
      x: '-50%',
      duration: 22,
      ease: 'none',
      repeat: -1,
    })

    const container = track.parentElement
    if (!container) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const slowDown = () => { if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 0.3, duration: 0.4 }) }
      const speedUp = () => { if (tweenRef.current) gsap.to(tweenRef.current, { timeScale: 1, duration: 0.4 }) }
      container.addEventListener('mouseenter', slowDown)
      container.addEventListener('mouseleave', speedUp)
      return () => { container.removeEventListener('mouseenter', slowDown); container.removeEventListener('mouseleave', speedUp) }
    })

    return () => {
      mm.revert()
      tweenRef.current?.kill()
    }
  }, [])

  return (
    <div id="marquee" className="overflow-hidden py-[10px] bg-[#080808] border-t-[0.5px] border-b-[0.5px] border-[#1e1e1a]">
      <div ref={trackRef} className="flex w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center font-mono text-[8px] sm:text-[10px] tracking-[0.22em] uppercase text-[#2e2e28] px-4 sm:px-6 border-r-[0.5px] border-[#1e1e1a] whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
