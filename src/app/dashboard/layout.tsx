// src/app/dashboard/layout.tsx
'use client'

import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect('/auth/login?redirect=/dashboard')
  }

  // Redirect to appropriate dashboard based on role
  if (user) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      redirect('/admin')
    }
    
    // For regular users, ensure they can access the dashboard
    if (user.role === UserRole.USER) {
      // Continue to render the dashboard
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}