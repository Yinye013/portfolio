'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

const experiences = [
  {
    role: 'Product Engineer',
    company: 'Product Studio HQ',
    period: 'Sep 2025 — Present',
    location: 'Lagos, Nigeria',
    logoInitials: 'PS',
    logoUrl: '/logos/productstudio.svg',
    logoInvert: true,
    logoWidth: 120,
    logoHeight: 32,
    bullets: [
      'Building product-focused web applications using Next.js and React, with a strong emphasis on frontend best practices.',
      'Implementing clean, maintainable component architecture with a focus on performance and user experience.',
      'Collaborating closely with product and design teams to translate requirements into high-quality interfaces.',
    ],
  },
  {
    role: 'Fullstack Developer',
    company: 'Union Systems Limited',
    period: 'Jul 2025 — Present',
    location: 'Lagos, Nigeria',
    logoInitials: 'US',
    logoUrl: '/logos/USLlogin.svg',
    logoInvert: false,
    bullets: [
      'Building and maintaining scalable fullstack applications using Angular and React on the frontend, and Java/Spring Boot on the backend.',
      'Designed component-driven UIs that meet WCAG accessibility standards and ensure cross-browser compatibility.',
      'Implemented lazy loading and optimized change detection strategies, reducing page load times and improving overall application performance.',
      'Translated wireframes and design prototypes into functional, high-performance interfaces in close collaboration with UX/UI designers.',
      'Integrated RESTful APIs using Angular\'s HttpClient and RxJS observables for robust, reactive data handling.',
    ],
  },
  {
    role: 'Frontend Engineer',
    company: 'Prizeet',
    period: 'Dec 2024 — Jul 2025',
    location: 'Lagos, Nigeria',
    logoInitials: 'PZ',
    logoUrl: '/logos/prizeet-transparent.svg',
    logoInvert: false,
    logoWidth: 100,
    logoHeight: 30,
    bullets: [
      'Engineered the Admin Dashboard, Seller Platform, and Buyer Platform using React.js and TypeScript, all of which are now live and serving active users.',
      'Integrated Firebase for real-time data management on the Seller Platform, improving data sync reliability.',
      'Optimized application performance through lazy loading, code-splitting, and memoization, resulting in faster load times and a smoother user experience.',
      'Participated actively in code reviews, enforcing best practices around clean, maintainable, and well-documented code.',
    ],
  },
  {
    role: 'Frontend Engineer',
    company: 'Utilour',
    period: 'Jan 2025 — Jun 2025',
    location: 'Lagos, Nigeria',
    logoInitials: 'UT',
    logoUrl: '/logos/utilolourNowhite.10ba1eee.svg',
    logoInvert: false,
    logoWidth: 120,
    logoHeight: 32,
    bullets: [
      'Developed and maintained the Admin Dashboard with Next.js, TypeScript, and Tailwind CSS, prioritizing performance, accessibility, and UX consistency.',
      'Architected reusable component systems, improving development speed and ensuring UI consistency across features.',
      'Optimized API consumption and state management flows, measurably improving application responsiveness.',
      'Collaborated closely with backend engineers and designers in an Agile environment, contributing to sprint planning, code reviews, and technical discussions.',
    ],
  },
  {
    role: 'Fullstack Engineer',
    company: 'Dev HQ',
    period: 'Mar 2024 — Feb 2025',
    location: 'Enugu, Nigeria',
    logoInitials: 'DH',
    logoUrl: '/logos/devhq.svg',
    logoInvert: false,
    logoWidth: 120,
    logoHeight: 40,
    bullets: [
      'Architected and shipped high-performance web applications using Next.js 14 and TypeScript, managing complex application state with Redux Toolkit.',
      'Designed and implemented RESTful API endpoints in Node.js and Express for authentication and full CRUD operations, incorporating secure data handling best practices.',
      'Built user authentication and role-based authorization systems, significantly improving application security posture.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Barleyfield',
    period: 'Oct 2022 — Sep 2023',
    location: 'Lagos, Nigeria',
    logoInitials: 'BF',
    logoUrl: '/logos/barleyfield.png',
    logoInvert: false,
    logoWidth: 45,
    logoHeight: 45,
    bullets: [
      'Delivered a full website revamp using HTML, CSS, JavaScript, and jQuery, modernizing the company\'s online presence and improving user experience.',
      'Followed strict design and coding guidelines to ensure visual consistency and maintainability across all pages.',
    ],
  },
]

export default function Experience() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionLabelRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const accentLineRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const mm = gsap.matchMedia()

    const accentLines = () => {
      accentLineRefs.current.forEach((line, i) => {
        if (!line) return
        gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.6, delay: i * 0.12 + 0.3, ease: 'power2.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
      })
    }

    mm.add('(min-width: 1024px)', () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -70, ease: 'none', scrollTrigger: { trigger: headingRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: sectionLabelRef.current, start: 'top 88%', toggleActions: 'play none none none' } })
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children) as HTMLElement[]
        cards.forEach((card, i) => {
          gsap.fromTo(card, { x: i % 2 === 0 ? -80 : 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
        })
      }
      accentLines()
      return () => {}
    })

    mm.add('(min-width: 768px) and (max-width: 1023px)', () => {
      if (headingRef.current) gsap.fromTo(headingRef.current, { y: 0 }, { y: -40, ease: 'none', scrollTrigger: { trigger: headingRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      if (sectionLabelRef.current) gsap.fromTo(sectionLabelRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: sectionLabelRef.current, start: 'top 88%', toggleActions: 'play none none none' } })
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children) as HTMLElement[]
        cards.forEach((card, i) => {
          gsap.fromTo(card, { x: i % 2 === 0 ? -80 : 80, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, delay: i * 0.12, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
        })
      }
      accentLines()
      return () => {}
    })

    mm.add('(min-width: 500px) and (max-width: 767px)', () => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children) as HTMLElement[]
        cards.forEach((card, i) => {
          gsap.fromTo(card, { x: i % 2 === 0 ? -60 : 60, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.6, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' } })
        })
      }
      accentLines()
      return () => {}
    })

    mm.add('(max-width: 499px)', () => {
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children) as HTMLElement[]
        cards.forEach((card, i) => {
          gsap.set(card, { clipPath: 'none' })
          gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.1, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' } })
        })
      }
      accentLines()
      return () => {}
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="experience" className="border-b border-border/50">
      {/* Header */}
      <div className="pt-9 px-5 sm:px-7">
        <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">Where I&apos;ve worked</span>
        </div>
        <h2 ref={headingRef} className="font-display text-[28px] sm:text-[32px] md:text-[36px] tracking-[0.04em] leading-none mb-6">
          <span className="text-[#e8e4dc]">Experience</span>
          <span className="text-accent">.</span>
        </h2>
      </div>

      {/* Cards */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-5 sm:px-7 pb-9">
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            className="relative overflow-hidden bg-[#0c0c0a] p-[14px] sm:p-[18px] border border-border/50"
            style={{ clipPath: 'inset(0 0 100% 0)' }}
          >
            {/* Top accent line */}
            <div ref={(el) => { accentLineRefs.current[idx] = el }} className="absolute top-0 left-0 right-0 h-px bg-accent/13" />

            {/* Logo + meta (flex row on mobile) */}
            <div className="flex sm:block items-center gap-3 mb-3">
              <div className="shrink-0">
                <Image
                  src={exp.logoUrl}
                  alt={exp.company}
                  width={exp.logoWidth ?? 154}
                  height={exp.logoHeight ?? 45}
                  className="object-contain"
                  style={exp.logoInvert ? { filter: 'invert(1)' } : undefined}
                />
              </div>
              <div className="sm:mt-3">
                <p className="font-sans text-[12px] font-medium text-[#c8c4bc] mb-[2px]">{exp.role}</p>
                <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-accent mb-[3px]">{exp.company}</p>
              </div>
            </div>

            <p className="font-mono text-[11px] tracking-widest uppercase text-[#3a3a34] mb-[2px]">{exp.period}</p>
            <p className="font-mono text-[11px] tracking-widest uppercase text-[#3a3a34] mb-3">{exp.location}</p>

            <ul className="flex flex-col gap-[6px]">
              {exp.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent mt-[2px] shrink-0 text-[10px]">›</span>
                  <span className="font-mono text-[12px] leading-[1.7] text-[#4a4a44]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
