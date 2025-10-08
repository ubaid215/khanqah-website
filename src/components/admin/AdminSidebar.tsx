// components/admin/AdminSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    href: '/admin',
    icon: '📊',
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: '🎓',
  },
  {
    name: 'Articles',
    href: '/admin/articles',
    icon: '📝',
  },
  {
    name: 'Books',
    href: '/admin/books',
    icon: '📚',
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: '👥',
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="space-y-2 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}