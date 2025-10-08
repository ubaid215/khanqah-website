// src/components/layout/dashboard-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Bookmark,
  Settings,
  GraduationCap,
  MessageCircle,
  Home,
} from 'lucide-react'

export function DashboardSidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Courses',
      href: '/dashboard/my-courses',
      icon: BookOpen,
    },
    {
      name: 'Certificates',
      href: '/dashboard/certificates',
      icon: Award,
    },
    {
      name: 'Bookmarks',
      href: '/dashboard/bookmarks',
      icon: Bookmark,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 border-r bg-background hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold text-xl">LMS Platform</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Back to Main Site */}
        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
