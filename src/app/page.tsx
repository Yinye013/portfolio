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
    <div className="flex items-center gap-3 px-7 py-2 bg-[#080808] border-y border-[#1a1a18]">
      <div className="flex-1 h-px bg-[#1a1a18]" />
      <span className="font-mono text-[9px] tracking-[0.18em] text-[#2e2e28] uppercase whitespace-nowrap">
        {number} — {label}
      </span>
      <div className="flex-1 h-px bg-[#1a1a18]" />
    </div>
  )
}

export default function Home() {
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
