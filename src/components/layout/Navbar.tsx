'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { themeColor } from '@/lib/theme'
import ThemeToggle from '@/components/ThemeToggle'
import { SiGithub, SiX } from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'

const navLinks = ['About', 'Projects', 'Skills', 'Experience', 'Contact'] as const

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault()
  scrollTo(id)
}

function Logo() {
  return (
    <div className="font-display text-[30px] tracking-[0.08em] leading-none">
      <span className="text-text-primary">OA</span>
      <span style={{ color: 'var(--c-fg-logo-dot)' }}>.</span>
    </div>
  )
}

function DesktopLinks() {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {navLinks.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          onClick={(e) => handleNavClick(e, link.toLowerCase())}
          className="font-mono text-[12px] tracking-[0.14em] uppercase text-text-nav hover:text-text-primary transition-colors duration-150"
        >
          {link}
        </a>
      ))}
    </div>
  )
}

function TabletLinks() {
  return (
    <div className="hidden md:flex lg:hidden items-center gap-4">
      {navLinks.map((link) => (
        <a
          key={link}
          href={`#${link.toLowerCase()}`}
          onClick={(e) => handleNavClick(e, link.toLowerCase())}
          className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-nav hover:text-text-primary transition-colors duration-150"
        >
          {link}
        </a>
      ))}
    </div>
  )
}

function HireMe({ className = '' }: { className?: string }) {
  return (
    <a
      href="mailto:yinadesanya@gmail.com"
      className={`font-mono text-[12px] tracking-[0.12em] uppercase text-accent border border-accent-border py-[6px] px-[14px] bg-transparent hover:bg-accent hover:text-background transition-colors duration-150 ${className}`}
    >
      Hire me
    </a>
  )
}

function NavContent() {
  return (
    <>
      <Logo />
      <DesktopLinks />
      <TabletLinks />
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <HireMe className="hidden md:inline-flex" />
      </div>
    </>
  )
}

export default function Navbar() {
  const fixedNavRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const overlayLinksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const nav = fixedNavRef.current
    if (!nav) return

    // GSAP tweens concrete colours, so the palette has to be resolved rather
    // than passed as var(). Resolve it inside onEnter, not out here: this
    // effect re-runs on a theme flip, but next-themes writes the class on
    // <html> in the same commit that schedules the effect, so a read at this
    // point still returns the outgoing theme's values.
    // On a theme flip this effect re-runs while the user may already be
    // scrolled past the trigger point, where onEnter will not fire again. Paint
    // the correct state for the current scroll position directly, on the next
    // frame so the new class is on <html> before the palette is read.
    const raf = requestAnimationFrame(() => {
      const scrolled = window.scrollY >= 60
      gsap.set(nav, {
        backgroundColor: scrolled ? themeColor('--c-bg') : 'transparent',
        borderBottomColor: scrolled ? themeColor('--c-line') : 'transparent',
        opacity: scrolled ? 1 : 0,
        y: scrolled ? 0 : -8,
        pointerEvents: scrolled ? 'auto' : 'none',
      })
    })

    ScrollTrigger.create({
      start: 60,
      onEnter: () => {
        gsap.to(nav, {
          backgroundColor: themeColor('--c-bg'),
          borderBottomColor: themeColor('--c-line'),
          duration: 0.3,
        })
        gsap.to(nav, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.3 })
      },
      onLeaveBack: () => {
        gsap.to(nav, { backgroundColor: 'transparent', borderBottomColor: 'transparent', duration: 0.3 })
        gsap.to(nav, { opacity: 0, y: -8, pointerEvents: 'none', duration: 0.3 })
      },
    })

    return () => {
      cancelAnimationFrame(raf)
      ScrollTrigger.getAll()
        .filter((t) => !t.vars.trigger)
        .forEach((t) => t.kill())
    }
  }, [resolvedTheme])

  useEffect(() => {
    const overlay = overlayRef.current
    const links = overlayLinksRef.current.filter((el): el is HTMLAnchorElement => el !== null)
    if (!overlay) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      gsap.set(overlay, { display: 'flex' })
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      gsap.fromTo(
        links,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: 'power3.out', delay: 0.1 },
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(links, { y: -20, opacity: 0, stagger: 0.04, duration: 0.2, ease: 'power2.in' })
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        delay: 0.15,
        ease: 'power2.in',
        onComplete: () => gsap.set(overlay, { display: 'none' }),
      })
    }
  }, [isOpen])

  function closeAndScroll(id: string) {
    setIsOpen(false)
    setTimeout(() => scrollTo(id), 350)
  }

  return (
    <>
      {/* Static nav (top of page) */}
      <nav className="flex items-center justify-between py-[18px] px-7 border-b-[0.5px] border-border bg-background">
        <NavContent />
        {/* Hamburger */}
        <button
          className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-5 h-px bg-text-nav" />
          ))}
        </button>
      </nav>

      {/* Fixed nav (after scroll) */}
      <nav
        ref={fixedNavRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between py-[18px] px-7 border-b-[0.5px]"
        style={{ opacity: 0, transform: 'translateY(-8px)', pointerEvents: 'none' }}
      >
        <NavContent />
        <button
          className="flex md:hidden flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className="block w-5 h-px bg-text-nav" />
          ))}
        </button>
      </nav>

      {/* Full-screen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] bg-overlay flex-col"
        style={{ display: 'none' }}
      >
        {/* Overlay top bar */}
        <div className="flex items-center justify-between py-[18px] px-7 border-b border-border-faint">
          <Logo />
          <button
            onClick={() => setIsOpen(false)}
            className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-dim cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Nav links */}
        <div className="flex flex-col px-6 pt-4 flex-1">
          {navLinks.map((link, i) => (
            <a
              key={link}
              ref={(el) => { overlayLinksRef.current[i] = el }}
              href={`#${link.toLowerCase()}`}
              onClick={(e) => { e.preventDefault(); closeAndScroll(link.toLowerCase()) }}
              className={`font-display leading-none py-[10px] border-b border-border-faint text-[42px] sm:text-[52px] ${
                link === 'Contact' ? 'text-accent' : 'text-text-outline hover:text-text-primary'
              } transition-colors duration-150`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Overlay bottom bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-faint">
          <div className="flex gap-2">
            {[
              { href: 'https://github.com/Yinye013', Icon: SiGithub, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/onyinyechukwu-adesanya-517489204/', Icon: FaLinkedinIn, label: 'LinkedIn' },
              { href: 'https://x.com/yinye_xx', Icon: SiX, label: 'X' },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="font-mono text-[8px] tracking-[0.1em] uppercase text-text-ghost p-[6px]"
                style={{ border: '0.5px solid var(--c-line)' }}
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] tracking-[0.1em] text-text-ghost">
              yinadesanya@gmail.com
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
