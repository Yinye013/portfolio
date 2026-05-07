'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const bio = {
  firstParagraph:
    "I'm a Full Stack Engineer with over 5 years of experience building scalable web applications across the entire stack. I care deeply about clean architecture, performance, and shipping products that actually solve problems.",
  secondParagraph:
    "When I'm not writing code I'm exploring new technologies, contributing to open source, or thinking about how to make complex systems simpler. I bring the same attention to detail to every project I touch.",
  photoUrl: 'https://placehold.co/400x500/0f0f0d/2e2e28?text=Photo',
}

export default function About() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionLabelRef = useRef<HTMLDivElement>(null)
  const para1Ref = useRef<HTMLParagraphElement>(null)
  const para2Ref = useRef<HTMLParagraphElement>(null)
  const annotationRef = useRef<HTMLSpanElement>(null)

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

      const fadeEls: [React.RefObject<HTMLElement | null>, number][] = [
        [sectionLabelRef as React.RefObject<HTMLElement>, 0],
        [para1Ref as React.RefObject<HTMLElement>, 0],
        [para2Ref as React.RefObject<HTMLElement>, 0.1],
        [annotationRef as React.RefObject<HTMLElement>, 0.2],
      ]

      fadeEls.forEach(([ref, delay]) => {
        if (ref.current) {
          gsap.fromTo(
            ref.current,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      })

      return () => ScrollTrigger.getAll().forEach((t) => t.kill())
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="grid grid-cols-2 border-b border-[#1e1e1a]" style={{ borderBottomWidth: '0.5px' }}>
      {/* Left — photo */}
      <div
        className="flex flex-col items-center justify-center py-10 px-7 bg-[#0f0f0d]"
        style={{ borderRight: '0.5px solid #1e1e1a', minHeight: '320px' }}
      >
        <div
          className="w-full max-w-[280px] aspect-[3/4] overflow-hidden relative"
          style={{ border: '0.5px solid #1e1e1a' }}
        >
          <Image src={bio.photoUrl} alt="Onyinyechukwu Adesanya" fill className="object-cover" />
        </div>
        <span
          className="mt-3 font-mono text-[9px] tracking-[0.12em] uppercase text-[#4a4a44] inline-block py-[3px] px-2"
          style={{ border: '0.5px dashed #2e2e28' }}
        >
          Photo via Contentful
        </span>
      </div>

      {/* Right — content */}
      <div
        className="flex flex-col justify-center py-10 px-8"
        style={{ borderLeft: '0.5px solid #1e1e1a' }}
      >
        <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
            Who I am
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display text-[36px] tracking-[0.04em] leading-none mb-5"
        >
          <span className="text-[#e8e4dc]">About </span>
          <span className="text-[#c8a96e]">me.</span>
        </h2>

        <p ref={para1Ref} className="text-xs text-[#7a7a70] leading-[1.8] mb-3">
          {bio.firstParagraph}
        </p>

        <p ref={para2Ref} className="text-xs text-[#7a7a70] leading-[1.8]">
          {bio.secondParagraph}
        </p>

        <span
          ref={annotationRef}
          className="block font-mono text-[8px] tracking-[0.1em] uppercase text-[#2e2e28] pl-2 mt-[10px]"
          style={{ borderLeft: '0.5px solid #1e1e1a' }}
        >
          ← bio text &amp; photo managed in Contentful CMS
        </span>
      </div>
    </section>
  )
}
