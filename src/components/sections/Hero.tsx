'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'

const WorkspaceScene = dynamic(() => import('@/components/WorkspaceScene'), { ssr: false })

const stats = [
  { number: 3, suffix: '+', label: 'Years experience' },
  { number: 15, suffix: '+', label: 'Projects shipped' },
  { number: 3, suffix: '', label: 'Open source libs' },
] as const

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const nameLineRefs = useRef<(HTMLSpanElement | null)[]>([null, null])
  const roleRef = useRef<HTMLParagraphElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([null, null])
  const statRowRef = useRef<HTMLDivElement>(null)
  const yearsRef = useRef<HTMLSpanElement>(null)
  const projectsRef = useRef<HTMLSpanElement>(null)
  const ossRef = useRef<HTMLSpanElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  const statNumRefs = [yearsRef, projectsRef, ossRef] as const

  useEffect(() => {
    const mm = gsap.matchMedia()

    const runEntryAnimations = (withMagnetic: boolean) => {
      gsap.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })

      nameLineRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, delay: 0.3 + i * 0.12, ease: 'power4.out' })
      })

      gsap.fromTo(roleRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 })
      gsap.fromTo(bioRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.85 })
      gsap.fromTo(
        btnRefs.current.filter((el): el is HTMLButtonElement => el !== null),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, delay: 1 },
      )
      gsap.fromTo(scrollHintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.4 })

      stats.forEach((stat, i) => {
        const ref = statNumRefs[i]?.current
        if (!ref) return
        const obj = { val: 0 }
        gsap.to(obj, {
          val: stat.number,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => { ref.textContent = Math.round(obj.val) + stat.suffix },
          scrollTrigger: { trigger: statRowRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })

      if (!withMagnetic) return

      const cleanups: (() => void)[] = []
      btnRefs.current.forEach((btn) => {
        if (!btn) return
        const onMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect()
          const dx = e.clientX - (rect.left + rect.width / 2)
          const dy = e.clientY - (rect.top + rect.height / 2)
          if (Math.hypot(dx, dy) < 80) gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.2, ease: 'power2.out' })
        }
        const onMouseLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' })
        btn.addEventListener('mousemove', onMouseMove)
        btn.addEventListener('mouseleave', onMouseLeave)
        cleanups.push(() => { btn.removeEventListener('mousemove', onMouseMove); btn.removeEventListener('mouseleave', onMouseLeave) })
      })
      return () => cleanups.forEach((fn) => fn())
    }

    mm.add('(min-width: 1024px)', () => { runEntryAnimations(true); return () => {} })
    mm.add('(min-width: 768px) and (max-width: 1023px)', () => { runEntryAnimations(false); return () => {} })
    mm.add('(min-width: 500px) and (max-width: 767px)', () => { runEntryAnimations(false); return () => {} })
    mm.add('(max-width: 499px)', () => {
      gsap.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 })
      nameLineRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.set(el, { clipPath: 'none' })
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 + i * 0.1 })
      })
      gsap.fromTo(roleRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.6 })
      gsap.fromTo(bioRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.75 })
      gsap.fromTo(btnRefs.current.filter((el): el is HTMLButtonElement => el !== null), { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.9 })
      stats.forEach((stat, i) => {
        const ref = statNumRefs[i]?.current
        if (!ref) return
        const obj = { val: 0 }
        gsap.to(obj, { val: stat.number, duration: 1.5, ease: 'power2.out', onUpdate: () => { ref.textContent = Math.round(obj.val) + stat.suffix }, scrollTrigger: { trigger: statRowRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
      })
      return () => {}
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="relative overflow-hidden border-b-[0.5px] border-[#1e1e1a]" id="hero">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left column */}
        <div className="pt-[56px] px-5 sm:px-7 pb-[48px]" style={{ borderRight: '0.5px solid #1e1e1a' }}>
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-[10px] mb-5">
            <div className="w-[28px] h-px bg-[#c8a96e]" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#c8a96e]">
              Full Stack Engineer
            </span>
          </div>

          {/* Name */}
          <div className="font-display leading-none tracking-[0.02em]">
            <span
              ref={(el) => { nameLineRefs.current[0] = el }}
              className="block text-[22px] sm:text-[26px] tracking-[0.12em] uppercase text-[#e8e4dc]/20 mb-1"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              Onyinyechukwu
            </span>
            <span
              ref={(el) => { nameLineRefs.current[1] = el }}
              className="block text-[22vw] sm:text-[56px] md:text-[64px] lg:text-[80px] leading-[0.88] uppercase text-[#e8e4dc]"
              style={{ clipPath: 'inset(0 100% 0 0)' }}
            >
              Adesanya
            </span>
          </div>

          {/* Role */}
          <p ref={roleRef} className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6a6a60] mt-[10px] mb-7">
            Building things for the web — front to back
          </p>

          {/* Bio */}
          <p ref={bioRef} className="text-[13px] text-[#8a8a80] leading-[1.7] max-w-[360px] mb-8">
            I design and engineer scalable, performant digital products. From pixel-perfect UIs to robust backend systems — I bring ideas to life end-to-end.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              ref={(el) => { btnRefs.current[0] = el }}
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-mono text-[10px] tracking-[0.14em] uppercase font-medium bg-[#c8a96e] text-[#0a0a0a] py-[10px] px-5 cursor-pointer hover:bg-[#d4b87a] transition-colors duration-150"
            >
              View Projects
            </button>
            <button
              ref={(el) => { btnRefs.current[1] = el }}
              className="font-mono text-[10px] tracking-[0.14em] uppercase bg-transparent text-[#6a6a60] border-[0.5px] border-[#2e2e28] py-[10px] px-5 cursor-pointer hover:text-[#e8e4dc] hover:border-[#6a6a60] transition-all duration-150"
            >
              Download CV
            </button>
          </div>

          {/* Stats */}
          <div ref={statRowRef} className="border-t-[0.5px] border-[#1e1e1a] pt-8 mt-8 grid grid-cols-3 gap-4 sm:flex sm:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label}>
                <div className="font-display text-[22px] sm:text-[28px] leading-none tracking-[0.04em] text-[#e8e4dc]">
                  <span ref={statNumRefs[i]}>0{stat.suffix}</span>
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-[#4a4a44] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Three.js workspace (hidden on mobile) */}
        <div className="hidden sm:block relative bg-[#080806]" style={{ minHeight: '280px' }}>
          <WorkspaceScene />
          <div
            ref={scrollHintRef}
            onClick={() => document.getElementById('marquee')?.scrollIntoView({ behavior: 'smooth' }) ?? document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="absolute right-7 bottom-7 flex flex-col items-center gap-[6px] cursor-pointer group"
          >
            <div className="w-px h-10 bg-gradient-to-b from-[#c8a96e] to-transparent group-hover:from-[#d4b87a] transition-colors duration-150" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#4a4a44] group-hover:text-[#6a6a60] transition-colors duration-150" style={{ writingMode: 'vertical-rl' }}>
              Scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
