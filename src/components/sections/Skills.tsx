'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const skillGroups = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', featured: true },
      { name: 'Next.js', featured: true },
      { name: 'Vue', featured: true },
      { name: 'Nuxt.js', featured: true },
      { name: 'Angular', featured: true },
      { name: 'TailwindCSS', featured: false },
      { name: 'GSAP', featured: false },
      { name: 'TypeScript', featured: false },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Node.js', featured: true },
      { name: 'Express', featured: true },
      { name: 'NestJS', featured: true },
      { name: 'Java', featured: true },
      { name: 'Spring Boot', featured: true },
    ],
  },
  {
    category: 'Styling',
    skills: [
      { name: 'HTML', featured: true },
      { name: 'CSS', featured: true },
      { name: 'SASS', featured: true },
    ],
  },
]

const gsapNotes = [
  'gsap scrolltrigger — staggered pill reveal',
  'gsap parallax — section heading shifts on scroll',
  'gsap fade — stat counters count up on enter',
  'gsap marquee — infinite scroll ticker',
]

export default function Skills() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionLabelRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const pillsRef = useRef<Array<HTMLDivElement | null>>([])
  const notesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 0 },
          {
            y: -70,
            ease: 'none',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      }

      if (sectionLabelRef.current) {
        gsap.fromTo(
          sectionLabelRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionLabelRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      pillsRef.current.forEach((container) => {
        if (!container) return
        gsap.fromTo(
          container.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: { each: 0.06, from: 'start' },
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      if (notesRef.current) {
        gsap.fromTo(
          notesRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.2,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: notesRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="skills"
      className="grid grid-cols-2"
      style={{ borderBottom: '0.5px solid #1e1e1a' }}
    >
      {/* Left — skill pills */}
      <div className="py-9 px-7" style={{ borderRight: '0.5px solid #1e1e1a' }}>
        <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
            What I work with
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display text-[36px] tracking-[0.04em] leading-none mb-5"
        >
          <span className="text-[#e8e4dc]">My </span>
          <span className="text-[#c8a96e]">stack.</span>
        </h2>

        {skillGroups.map((group, i) => (
          <div key={group.category} className="mb-5">
            <p
              className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#4a4a44] mb-2 pb-[6px]"
              style={{ borderBottom: '0.5px solid #1a1a18' }}
            >
              {group.category}
            </p>
            <div
              ref={(el) => { pillsRef.current[i] = el }}
              className="flex flex-wrap gap-[5px]"
            >
              {group.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="font-mono text-[9px] tracking-[0.1em] uppercase py-1 px-2"
                  style={{
                    color: skill.featured ? '#c8a96e' : '#8a8a80',
                    border: `0.5px solid ${skill.featured ? '#c8a96e33' : '#242420'}`,
                    background: skill.featured ? '#c8a96e08' : 'transparent',
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Right — GSAP notes */}
      <div className="py-9 px-7 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
            Scroll trigger note
          </span>
        </div>

        <p ref={descRef} className="text-[11px] text-[#5a5a52] leading-[1.8] mb-4">
          Each skill pill animates in with a staggered GSAP reveal as you scroll into the section.
          The active (gold) pills fire first, then the rest follow with a slight delay.
        </p>

        <div ref={notesRef}>
          {gsapNotes.map((note) => (
            <div key={note} className="flex items-center gap-[6px] mt-2">
              <div className="w-[6px] h-[6px] rounded-full bg-[#2e6e44] shrink-0" />
              <span className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#3a3a34]">
                {note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
