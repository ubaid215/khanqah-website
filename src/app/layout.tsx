// src/app/layout.tsx
import { Inter, Manrope, Noto_Serif } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/providers/AuthProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { cn } from "@/lib/utils";

// Sacred Editorial Fonts - using Next.js optimized loading
const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const notoSerif = Noto_Serif({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700']
})

// Fallback for Inter (optional, can be removed if not needed)
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

// Note: Amiri for Arabic - separate installation needed
// npm install @fontsource/amiri

export const metadata = {
  title: 'Khanqah Saifia',
  description: 'A center of divine wisdom and spiritual purification through the teachings of Islam.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={cn(
        manrope.variable,
        notoSerif.variable,
        inter.variable
      )}
    >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <main>
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}