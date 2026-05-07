'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const socials = ['GitHub', 'LinkedIn', 'Twitter'] as const

export default function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionLabelRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

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

      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: subRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (socialsRef.current) {
        gsap.fromTo(
          socialsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: socialsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formRef.current,
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

  const inputClass =
    'w-full bg-[#0f0f0d] text-[#8a8a80] font-sans text-[11px] py-2 px-3 outline-none focus:border-[#3a3a34] transition-colors'

  return (
    <section
      id="contact"
      className="grid grid-cols-2"
      style={{ borderBottom: '0.5px solid #1e1e1a' }}
    >
      {/* Left column */}
      <div
        className="flex flex-col justify-center py-10 px-7"
        style={{ borderRight: '0.5px solid #1e1e1a' }}
      >
        <div ref={sectionLabelRef} className="flex items-center gap-2 mb-[6px]">
          <div className="w-[14px] h-px bg-[#5a5a52]" />
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#5a5a52]">
            Get in touch
          </span>
        </div>

        <h2
          ref={headingRef}
          className="font-display text-[42px] tracking-[0.03em] leading-[0.95] mb-[14px]"
        >
          <span className="block text-[#e8e4dc]">Let&apos;s</span>
          <span className="block text-[#2e2e28]">build</span>
          <span className="block text-[#e8e4dc]">something.</span>
        </h2>

        <p ref={subRef} className="text-[11px] text-[#5a5a52] leading-[1.7] mb-5 max-w-[260px]">
          Open to full-time roles, freelance contracts, and interesting collaborations. Don&apos;t
          hesitate to reach out.
        </p>

        <div ref={socialsRef} className="flex gap-2">
          {socials.map((label) => (
            <a
              key={label}
              href="#"
              className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#5a5a52] py-[5px] px-[10px] hover:text-[#c8a96e] hover:border-[#c8a96e33] transition-colors cursor-pointer"
              style={{ border: '0.5px solid #1e1e1a' }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-col justify-center py-10 px-7 bg-[#0f0f0d]">
        <div ref={formRef} className="flex flex-col gap-3">
          {/* Name */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="contact-name" className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#4a4a44]">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Your name"
              className={inputClass}
              style={{ border: '0.5px solid #1e1e1a' }}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="contact-email" className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#4a4a44]">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              placeholder="your@email.com"
              className={inputClass}
              style={{ border: '0.5px solid #1e1e1a' }}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="contact-message" className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#4a4a44]">
              Message
            </label>
            <textarea
              id="contact-message"
              placeholder="What are you working on?"
              rows={4}
              className={`${inputClass} resize-none`}
              style={{ border: '0.5px solid #1e1e1a' }}
            />
          </div>

          <button
            type="button"
            className="mt-1 inline-block font-mono text-[10px] tracking-[0.14em] uppercase font-medium text-[#0a0a0a] bg-[#c8a96e] py-[10px] px-5 cursor-pointer"
          >
            Send message
          </button>
        </div>
      </div>
    </section>
  )
}
