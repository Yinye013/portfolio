'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // The palette lives on `:root` (dark) and `.light`, so the dark class is
      // cosmetic — but Tailwind's `dark:` variant relies on it being present.
      value={{ light: 'light', dark: 'dark' }}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
