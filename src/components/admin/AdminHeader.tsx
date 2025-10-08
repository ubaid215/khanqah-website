// components/admin/AdminHeader.tsx
'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content and users</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="outline">User Dashboard</Button>
          </Link>
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