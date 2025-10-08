// src/app/(main)/layout.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { isLoading } = useAuth()

  // Show loading state while checking authentication
  // This ensures any auth-dependent content in main pages loads properly
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main website layout - add headers, footers, navigation here later */}
      <div className="flex flex-col min-h-screen">
        {/* Header can be added here */}
        {/* <Header /> */}
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer can be added here */}
        {/* <Footer /> */}
      </div>
    </div>
  )
}