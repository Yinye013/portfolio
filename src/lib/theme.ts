/**
 * Reads a palette variable from `globals.css` off the document root.
 *
 * GSAP tweens colours as concrete values and cannot animate `var(...)`, so any
 * animated colour has to be resolved at the moment the tween is built. Because
 * the variables are redefined on `.light`, re-reading on a theme change is what
 * keeps GSAP-driven colours in sync with the rest of the page.
 */
export function themeColor(name: string, fallback = ''): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name)
  return value.trim() || fallback
}
