// src/components/user/Sidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Book,
  HelpCircle,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Courses',
    href: '/dashboard/courses',
    icon: BookOpen,
  },
  // {
  //   name: 'Questions',
  //   href: '/dashboard/questions',
  //   icon: HelpCircle,
  // },
  // {
  //   name: 'Certificates',
  //   href: '/dashboard/certificates',
  //   icon: Award,
  // },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out h-screen sticky top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Dashbaord</span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 group hover:scale-105",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                  isActive ? "text-blue-600 scale-110" : "text-gray-400 group-hover:text-gray-600 group-hover:scale-110"
                )}
              />
              {!isCollapsed && (
                <span className="ml-3 transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Progress Summary */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-800 mb-1">Learning Progress</p>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '45%' }}
              ></div>
            </div>
            <p className="text-xs text-blue-700 mt-1">45% Complete</p>
          </div>
        </div>
      )}
    </div>
  )
}