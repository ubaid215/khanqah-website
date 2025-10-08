// src/components/layout/admin-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Library,
  MessageCircle,
  Users,
  Settings,
  Shield,
  Home,
  FolderTree,
  Tags,
} from 'lucide-react'

interface AdminSidebarProps {
  userRole: string
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Overview',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Courses',
      href: '/admin/courses',
      icon: GraduationCap,
    },
    {
      name: 'Articles',
      href: '/admin/articles',
      icon: BookOpen,
    },
    {
      name: 'Books',
      href: '/admin/books',
      icon: Library,
    },
    {
      name: 'Q&A',
      href: '/admin/qa',
      icon: MessageCircle,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
    },
    {
      name: 'Tags',
      href: '/admin/tags',
      icon: Tags,
    },
  ]

  // Super Admin only
  if (userRole === 'SUPER_ADMIN') {
    navigation.push({
      name: 'System Settings',
      href: '/admin/settings',
      icon: Settings,
    })
  }

  return (
    <aside className="w-64 border-r bg-background hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <span className="font-bold text-xl block">Admin Panel</span>
              <span className="text-xs text-muted-foreground">{userRole}</span>
            </div>
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
        <div className="p-4 border-t space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>User Dashboard</span>
          </Link>
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
