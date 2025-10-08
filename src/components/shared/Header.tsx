// components/shared/Header.tsx
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LearnHub
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">
              Courses
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-blue-600 transition-colors">
              Articles
            </Link>
            <Link href="/questions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Q&A
            </Link>
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition-colors">
              Books
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline">Admin</Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}