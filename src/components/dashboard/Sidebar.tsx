// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: '📊',
  },
  {
    name: 'My Courses',
    href: '/dashboard/my-courses',
    icon: '🎓',
  },
  {
    name: 'Progress',
    href: '/dashboard/progress',
    icon: '📈',
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
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
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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