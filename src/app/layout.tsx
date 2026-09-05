import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'
import ThemeProvider from '@/components/ThemeProvider'
import Preloader from '@/components/Preloader'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
})

export const metadata: Metadata = {
  title: 'Onyinyechukwu Adesanya — Full Stack Engineer',
  description: 'Full Stack Engineer building scalable, performant digital products.',
}

/*
 * Preloader styles, inlined deliberately.
 *
 * These cannot live in globals.css or a CSS module: an imported stylesheet is
 * render-blocking, so the loader would not paint any earlier than the page it
 * exists to cover, which defeats the point. Inlined here they are part of the
 * first HTML response.
 *
 * Every colour is a palette variable from globals.css, so the loader themes
 * itself along with the rest of the site (see the Theming section of CLAUDE.md —
 * never hardcode a colour). Each var() carries the dark-palette value as a
 * fallback only: Next hoists the globals.css <link> above this <style>, so for
 * the first frames the variables may be unresolved, and a bare var() would paint
 * a transparent overlay over half-hydrated markup. The fallbacks are never the
 * source of truth — once the sheet lands the tokens win, in both themes.
 * --font-display arrives via the class on <body>, so the mark declares a real
 * font fallback for the frames before it resolves.
 *
 * The animation is pure CSS: at the moment this paints, GSAP has not parsed.
 */
const preloaderStyles = `
#preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  background: var(--c-bg, #0a0a0a);
  opacity: 1;
  /* Keep in sync with FADE_MS in src/components/Preloader.tsx. */
  transition: opacity 500ms ease;
}

#preloader[data-hiding] {
  opacity: 0;
  pointer-events: none;
}

#preloader .pl-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

/* Matches Logo() in src/components/layout/Navbar.tsx so the mark and the navbar
   logo read as the same object across the handoff. */
#preloader .pl-mark {
  font-family: var(--font-display), sans-serif;
  font-size: 44px;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--c-fg, #e8e4dc);
}

#preloader .pl-dot { color: var(--c-fg-logo-dot, #b4ac9c); }

#preloader .pl-track {
  position: relative;
  width: 180px;
  height: 1px;
  overflow: hidden;
  background: var(--c-line, #1e1e1a);
}

#preloader .pl-bar {
  position: absolute;
  inset: 0;
  background: var(--c-accent, #c8a96e);
  transform-origin: left center;
  animation: pl-sweep 1.1s ease-in-out infinite;
}

/* transform only — no layout-inducing properties, so this stays on the
   compositor and cannot contend with hydration. */
@keyframes pl-sweep {
  0%   { transform: translateX(-100%) scaleX(0.4); }
  50%  { transform: translateX(0%)    scaleX(0.7); }
  100% { transform: translateX(100%)  scaleX(0.4); }
}

/* Screen-reader-only label. */
#preloader .pl-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

@media (prefers-reduced-motion: reduce) {
  /* Static half-strength rule instead of the sweep. The opacity fade-out stays:
     a 500ms cross-fade is not vestibular motion, and keeping it makes the
     handoff read as deliberate rather than as an abrupt cut. */
  #preloader .pl-bar {
    animation: none;
    transform: none;
    opacity: 0.5;
  }
}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: preloaderStyles }} />
      </head>
      <body className={`${dmSans.variable} ${dmMono.variable} ${bebasNeue.variable} antialiased`} suppressHydrationWarning>
        {/* Outside ThemeProvider and SmoothScroll: it must not remount on a theme
            flip, and it needs no Lenis context. position:fixed + z-index put it
            above the Navbar's own fixed bar regardless of DOM order. */}
        <Preloader />
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
