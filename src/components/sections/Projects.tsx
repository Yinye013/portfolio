'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const projects = [
  {
    id: 1,
    number: '01',
    title: 'Project Title One',
    description:
      'A scalable SaaS platform built for teams. Handles real-time collaboration, role-based access, and complex data visualisation.',
    tags: ['Next.js', 'Node', 'Postgres'],
    primaryTag: 'Next.js',
    imageUrl: 'https://placehold.co/600x400/0f0f0d/2e2e28?text=Project+01',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 2,
    number: '02',
    title: 'Project Title Two',
    description:
      'A high-performance e-commerce backend powering thousands of transactions daily. Built with Java microservices and a React storefront.',
    tags: ['React', 'Spring Boot', 'Java'],
    primaryTag: 'React',
    imageUrl: 'https://placehold.co/600x400/0f0f0d/2e2e28?text=Project+02',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    id: 3,
    number: '03',
    title: 'Project Title Three',
    description:
      'A real-time logistics dashboard with live tracking, predictive analytics, and a fully custom mapping engine.',
    tags: ['Vue', 'NestJS', 'Redis'],
    primaryTag: 'Vue',
    imageUrl: 'https://placehold.co/600x400/0f0f0d/2e2e28?text=Project+03',
    liveUrl: '#',
    githubUrl: '#',
  },
]

export default function Projects() {
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
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
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
    <section id="projects" className="py-9 px-7" style={{ borderBottom: '0.5px solid #1e1e1a' }}>
      {/* Header row */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
            <div className="w-[14px] h-px bg-[#5a5a52]" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
              What I&apos;ve built
            </span>
          </div>
          <h2
            ref={headingRef}
            className="font-display text-[36px] tracking-[0.04em] leading-none"
          >
            <span className="text-[#e8e4dc]">Selected </span>
            <span className="text-[#c8a96e]">work.</span>
          </h2>
        </div>

        <a
          href="#"
          className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#c8a96e] cursor-pointer"
        >
          See all →
        </a>
      </div>

      {/* Cards grid */}
      <div ref={cardsRef} className="grid grid-cols-3 gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-[#0f0f0d] overflow-hidden"
            style={{ border: '0.5px solid #1e1e1a' }}
          >
            {/* Image */}
            <div
              className="w-full h-[100px] bg-[#151513] relative overflow-hidden"
              style={{ borderBottom: '0.5px solid #1e1e1a' }}
            >
              <Image src={project.imageUrl} alt={project.title} fill className="object-cover" />
              <span
                className="absolute top-2 right-2 font-mono text-[8px] tracking-[0.1em] uppercase text-[#4a4a44] py-[2px] px-[6px]"
                style={{ border: '0.5px dashed #2a2a26' }}
              >
                Contentful img
              </span>
            </div>

            {/* Body */}
            <div className="p-[14px]">
              <p className="font-mono text-[9px] tracking-[0.14em] text-[#3a3a34] mb-1">
                {project.number}
              </p>
              <p className="font-sans text-xs font-medium text-[#d8d4cc] mb-1">{project.title}</p>
              <p className="text-[11px] text-[#5a5a52] leading-[1.5] mb-[10px]">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[8px] tracking-[0.1em] uppercase py-[2px] px-[6px]"
                    style={{
                      color: tag === project.primaryTag ? '#c8a96e' : '#5a5a52',
                      border: `0.5px solid ${tag === project.primaryTag ? '#c8a96e44' : '#2a2a26'}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
