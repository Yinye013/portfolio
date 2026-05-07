import type { Metadata } from 'next'
import { DM_Sans, DM_Mono, Bebas_Neue } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Onyinyechukwu Adesanya — Full Stack Engineer',
  description: 'Full Stack Engineer building scalable, performant digital products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
