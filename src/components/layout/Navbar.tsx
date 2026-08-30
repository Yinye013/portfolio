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

/**
 * CV download. The file lives in `public/`, so it is served from the site root;
 * `download` gives the saved file a clean name rather than the hashed path.
 */
function Resume({ className = '' }: { className?: string }) {
  return (
    <a
      href="/onyinyechukwu-adesanya-cv.pdf"
      download="Onyinyechukwu-Adesanya-CV.pdf"
      className={`font-mono text-[12px] tracking-[0.12em] uppercase text-text-nav border border-border py-[6px] px-[14px] bg-transparent hover:text-accent hover:border-accent-border transition-colors duration-150 ${className}`}
    >
      Résumé
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
        {/* <Resume className="hidden md:inline-flex" /> */}
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
    // than passed as var(). `themeColor` reads the custom properties off
    // <html>, which update synchronously with the class next-themes sets, so
    // reading at effect time returns the incoming theme's values.
    //
    // This effect re-runs on every theme flip. The problem it has to solve:
    // ScrollTrigger's onEnter/onLeaveBack only fire on a *crossing*, so when
    // the user flips the theme while already scrolled past the trigger point,
    // nothing repaints the nav and it keeps the previous palette's colours
    // baked into its inline style until the user scrolls up and back down.
    //
    // So paint the correct state for the CURRENT scroll position explicitly on
    // every run, and do it after the trigger exists so the trigger's own
    // initial refresh cannot overwrite it. `gsap.set` (not `to`) and killing
    // in-flight tweens first, so a half-finished 0.3s colour tween from a
    // previous crossing cannot land on the old target afterwards.
    const paint = () => {
      const scrolled = window.scrollY >= 60
      gsap.killTweensOf(nav)
      gsap.set(nav, {
        backgroundColor: scrolled ? themeColor('--c-bg') : 'transparent',
        borderBottomColor: scrolled ? themeColor('--c-line') : 'transparent',
        opacity: scrolled ? 1 : 0,
        y: scrolled ? 0 : -8,
        pointerEvents: scrolled ? 'auto' : 'none',
      })
    }

    const trigger = ScrollTrigger.create({
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

    // next-themes updates its React state (and so re-runs this effect) in the
    // same commit that writes the class onto <html>, but the DOM write lands
    // after this effect body runs. Reading the palette here would therefore
    // return the OUTGOING theme's values and leave the nav one flip behind, so
    // defer the paint by a frame — by then the class is on <html> and the
    // custom properties resolve to the incoming theme.
    const raf = requestAnimationFrame(paint)

    return () => {
      cancelAnimationFrame(raf)
      // Kill only this effect's own trigger. `ScrollTrigger.getAll()` is global,
      // so filtering by `!t.vars.trigger` would also take out any other
      // section's start-offset trigger — see the note in CLAUDE.md.
      trigger.kill()
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
          {/* Drawn from two 1px bars rather than an icon-font glyph, so it
              carries the same hairline weight as the hamburger it replaces. */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="relative grid place-items-center w-6 h-6 cursor-pointer text-text-dim hover:text-text-primary transition-colors duration-150"
          >
            <span className="col-start-1 row-start-1 block w-5 h-px bg-current rotate-45" />
            <span className="col-start-1 row-start-1 block w-5 h-px bg-current -rotate-45" />
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
            {/* <a
              href="/onyinyechukwu-adesanya-cv.pdf"
              download="Onyinyechukwu-Adesanya-CV.pdf"
              className="font-mono text-[8px] tracking-[0.1em] uppercase text-text-ghost hover:text-accent transition-colors duration-150"
            >
              Résumé
            </a> */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
