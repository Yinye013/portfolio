'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const nameLines = ['Onyinyechukwu', 'Adesanya'] as const

const stats = [
  { number: '5+', label: 'Years experience' },
  { number: '20+', label: 'Projects shipped' },
  { number: '3', label: 'Open source libs' },
] as const

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const nameLineRefs = useRef<(HTMLSpanElement | null)[]>([null, null])
  const roleRef = useRef<HTMLParagraphElement>(null)
  const bioRef = useRef<HTMLParagraphElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([null, null])
  const statRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const scrollHintRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2 }
      )
      gsap.fromTo(
        nameLineRefs.current.filter((el): el is HTMLSpanElement => el !== null),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, delay: 0.3 }
      )
      gsap.fromTo(
        roleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.7 }
      )
      gsap.fromTo(
        bioRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.85 }
      )
      gsap.fromTo(
        btnRefs.current.filter((el): el is HTMLButtonElement => el !== null),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, delay: 1 }
      )
      gsap.fromTo(
        statRefs.current.filter((el): el is HTMLDivElement => el !== null),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.4, delay: 1.1 }
      )
      gsap.fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, delay: 1.4 }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="relative overflow-hidden pt-[56px] px-7 pb-[48px] border-b-[0.5px] border-[#1e1e1a]">
      {/* Eyebrow */}
      <div ref={eyebrowRef} className="flex items-center gap-[10px] mb-5">
        <div className="w-[28px] h-px bg-[#c8a96e]" />
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#c8a96e]">
          Full Stack Engineer
        </span>
      </div>

      {/* Name */}
      <div className="font-display text-[68px] leading-[0.92] tracking-[0.02em]">
        {nameLines.map((name, i) => (
          <span
            key={name}
            className="block text-[#e8e4dc]"
            ref={(el) => { nameLineRefs.current[i] = el }}
          >
            {name}
          </span>
        ))}
      </div>

      {/* Role line */}
      <p
        ref={roleRef}
        className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6a6a60] mt-[10px] mb-7"
      >
        Building things for the web — front to back
      </p>

      {/* Bio */}
      <p
        ref={bioRef}
        className="text-[13px] text-[#8a8a80] leading-[1.7] max-w-[360px] mb-8"
      >
        I design and engineer scalable, performant digital products. From pixel-perfect UIs
        to robust backend systems — I bring ideas to life end-to-end.
      </p>

      {/* CTA buttons */}
      <div className="flex gap-3">
        <button
          ref={(el) => { btnRefs.current[0] = el }}
          onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-mono text-[10px] tracking-[0.14em] uppercase font-medium bg-[#c8a96e] text-[#0a0a0a] py-[10px] px-5"
        >
          View Projects
        </button>
        <button
          ref={(el) => { btnRefs.current[1] = el }}
          className="font-mono text-[10px] tracking-[0.14em] uppercase bg-transparent text-[#6a6a60] border-[0.5px] border-[#2e2e28] py-[10px] px-5"
        >
          Download CV
        </button>
      </div>

      {/* Stats */}
      <div className="border-t-[0.5px] border-[#1e1e1a] pt-8 mt-2 flex gap-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el) => { statRefs.current[i] = el }}
          >
            <div className="font-display text-[28px] leading-none tracking-[0.04em] text-[#e8e4dc]">
              {stat.number}
            </div>
            <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#4a4a44] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="absolute right-7 bottom-7 flex flex-col items-center gap-[6px]">
        <div className="w-px h-10 bg-gradient-to-b from-[#c8a96e] to-transparent" />
        <span
          className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#4a4a44]"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
