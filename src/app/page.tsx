'use client'

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Marquee from '@/components/sections/Marquee'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Contact from '@/components/sections/Contact'

interface SectionDividerProps {
  number: string
  label: string
}

function SectionDivider({ number, label }: SectionDividerProps) {
  return (
    <div className="flex items-center gap-3 px-7 py-2 bg-bg-deep border-y border-border-soft">
      <div className="flex-1 h-px bg-border-soft" />
      <span className="font-mono text-[10px] tracking-[0.18em] text-text-ghost uppercase whitespace-nowrap">
        {number} — {label}
      </span>
      <div className="flex-1 h-px bg-border-soft" />
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <SectionDivider number="02" label="About" />
      <About />
      <SectionDivider number="03" label="Projects" />
      <Projects />
      <SectionDivider number="04" label="Skills" />
      <Skills />
      <SectionDivider number="05" label="Experience" />
      <Experience />
      <SectionDivider number="06" label="Contact" />
      <Contact />
      <Footer />
    </>
  )
}
