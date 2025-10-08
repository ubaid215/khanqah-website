// src/app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  FileText, 
  Book, 
  HelpCircle, 
  Users, 
  Download,
  TrendingUp,
  Eye,
  Plus,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalCourses: number
  totalArticles: number
  totalBooks: number
  totalQuestions: number
  totalUsers: number
  totalDownloads: number
  recentActivities: any[]
  popularCourses: any[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // In a real app, you'd have a dedicated dashboard stats endpoint
      // For now, we'll simulate the data
      const mockStats: DashboardStats = {
        totalCourses: 24,
        totalArticles: 156,
        totalBooks: 42,
        totalQuestions: 89,
        totalUsers: 1234,
        totalDownloads: 4567,
        recentActivities: [
          { id: 1, action: 'New course published', user: 'John Doe', time: '2 minutes ago', type: 'course' },
          { id: 2, action: 'Article updated', user: 'Sarah Smith', time: '1 hour ago', type: 'article' },
          { id: 3, action: 'New book added', user: 'Mike Johnson', time: '3 hours ago', type: 'book' },
          { id: 4, action: 'Question answered', user: 'Emily Davis', time: '5 hours ago', type: 'question' },
          { id: 5, action: 'User registered', user: 'Alex Wilson', time: '1 day ago', type: 'user' }
        ],
        popularCourses: [
          { id: 1, title: 'Introduction to Web Development', students: 1245, progress: 85 },
          { id: 2, title: 'Advanced React Patterns', students: 892, progress: 92 },
          { id: 3, title: 'Node.js Backend Development', students: 756, progress: 78 }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      description: '+12% from last month',
      change: 'positive',
      color: 'bg-blue-500',
      href: '/admin/courses'
    },
    {
      title: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: FileText,
      description: '+8% from last month',
      change: 'positive',
      color: 'bg-green-500',
      href: '/admin/articles'
    },
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      icon: Book,
      description: '+5% from last month',
      change: 'positive',
      color: 'bg-purple-500',
      href: '/admin/books'
    },
    {
      title: 'Total Questions',
      value: stats?.totalQuestions || 0,
      icon: HelpCircle,
      description: '+15% from last month',
      change: 'positive',
      color: 'bg-orange-500',
      href: '/admin/questions'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      description: '+20% from last month',
      change: 'positive',
      color: 'bg-pink-500',
      href: '/admin/users'
    },
    {
      title: 'Total Downloads',
      value: stats?.totalDownloads || 0,
      icon: Download,
      description: '+18% from last month',
      change: 'positive',
      color: 'bg-indigo-500',
      href: '/admin/books'
    }
  ]

  const quickActions = [
    {
      title: 'Add Course',
      description: 'Create new course',
      icon: BookOpen,
      href: '/admin/courses/create',
      color: 'text-blue-600'
    },
    {
      title: 'Write Article',
      description: 'Publish new article',
      icon: FileText,
      href: '/admin/articles/create',
      color: 'text-green-600'
    },
    {
      title: 'Upload Book',
      description: 'Add new book',
      icon: Book,
      href: '/admin/books/create',
      color: 'text-purple-600'
    },
    {
      title: 'Manage Users',
      description: 'View all users',
      icon: Users,
      href: '/admin/users',
      color: 'text-pink-600'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name || user?.email}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="h-5 w-5" />
          <span className="font-medium">System is running smoothly</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      {stat.change === 'positive' ? (
                        <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <p className="text-sm text-green-600">{stat.description}</p>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'course' ? 'bg-blue-500' :
                    activity.type === 'article' ? 'bg-green-500' :
                    activity.type === 'book' ? 'bg-purple-500' :
                    activity.type === 'question' ? 'bg-orange-500' : 'bg-pink-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                    <action.icon className={`h-6 w-6 mb-2 ${action.color}`} />
                    <p className="font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.popularCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500">{course.students} students</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{course.progress}%</p>
                      <p className="text-xs text-gray-500">Completion</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}