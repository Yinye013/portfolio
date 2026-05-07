'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

const experiences = [
  {
    id: 1,
    role: 'Senior Full Stack Engineer',
    company: 'TechCorp Solutions',
    period: '2022 — Present',
    logoInitials: 'TC',
    logoUrl: 'https://placehold.co/36x36/161614/2a2a26?text=TC',
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'Nexus Digital',
    period: '2021 — 2022',
    logoInitials: 'ND',
    logoUrl: 'https://placehold.co/36x36/161614/2a2a26?text=ND',
  },
  {
    id: 3,
    role: 'Frontend Engineer',
    company: 'Stackwave Labs',
    period: '2020 — 2021',
    logoInitials: 'SL',
    logoUrl: 'https://placehold.co/36x36/161614/2a2a26?text=SL',
  },
  {
    id: 4,
    role: 'Junior Frontend Developer',
    company: 'Brightline Agency',
    period: '2019 — 2020',
    logoInitials: 'BA',
    logoUrl: 'https://placehold.co/36x36/161614/2a2a26?text=BA',
  },
  {
    id: 5,
    role: 'Software Engineering Intern',
    company: 'Orbit Systems',
    period: '2018 — 2019',
    logoInitials: 'OS',
    logoUrl: 'https://placehold.co/36x36/161614/2a2a26?text=OS',
  },
]

export default function Experience() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionLabelRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" style={{ borderBottom: '0.5px solid #1e1e1a' }}>
      {/* Header */}
      <div className="pt-9 px-7">
        <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
            Where I&apos;ve worked
          </span>
        </div>
        <h2
          ref={headingRef}
          className="font-display text-[36px] tracking-[0.04em] leading-none mb-6"
        >
          <span className="text-[#e8e4dc]">Experience</span>
          <span className="text-[#c8a96e]">.</span>
        </h2>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="grid grid-cols-3 gap-3 px-7 pb-9">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="relative overflow-hidden bg-[#0c0c0a] p-[18px]"
            style={{ border: '0.5px solid #1e1e1a' }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-[#c8a96e22]" />

            {/* Logo */}
            <div
              className="relative overflow-hidden w-9 h-9 flex items-center justify-center bg-[#161614] mb-3"
              style={{ border: '0.5px solid #2a2a26' }}
            >
              <Image src={exp.logoUrl} alt={exp.company} fill className="object-contain" />
            </div>

            <p className="font-sans text-[11px] font-medium text-[#c8c4bc] mb-[2px]">{exp.role}</p>
            <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#c8a96e] mb-[6px]">
              {exp.company}
            </p>
            <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#3a3a34]">
              {exp.period}
            </p>

            <span
              className="inline-block mt-2 font-mono text-[8px] tracking-[0.1em] uppercase text-[#3a3a34] py-[2px] px-[5px]"
              style={{ border: '0.5px dashed #2a2a26' }}
            >
              Logo via Contentful
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
