// components/dashboard/DashboardHeader.tsx
'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface DashboardHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    avatar?: string | null
  }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}