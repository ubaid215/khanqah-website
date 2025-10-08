// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS Platform - Learn, Grow, Succeed',
  description: 'Comprehensive learning management system with courses, articles, and interactive learning',
  keywords: 'LMS, learning, courses, education, online learning, tutorials',
  authors: [{ name: 'Your Institute Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'LMS Platform - Learn, Grow, Succeed',
    description: 'Comprehensive learning management system',
    siteName: 'LMS Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LMS Platform',
    description: 'Comprehensive learning management system',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}