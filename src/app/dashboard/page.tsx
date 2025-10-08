// src/app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  PlayCircle,
  Calendar,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface CourseProgress {
  id: string
  title: string
  progress: number
  thumbnail?: string
  nextLesson: string
  enrolledAt: string
}

interface DashboardStats {
  enrolledCourses: number
  completedCourses: number
  totalProgress: number
  learningHours: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCourses, setRecentCourses] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockStats: DashboardStats = {
        enrolledCourses: 8,
        completedCourses: 3,
        totalProgress: 65,
        learningHours: 42
      }

      const mockCourses: CourseProgress[] = [
        {
          id: '1',
          title: 'Advanced React Patterns',
          progress: 75,
          nextLesson: 'State Management with Zustand',
          enrolledAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Node.js Backend Development',
          progress: 45,
          nextLesson: 'Building RESTful APIs',
          enrolledAt: '2024-01-20'
        },
        {
          id: '3',
          title: 'TypeScript Masterclass',
          progress: 90,
          nextLesson: 'Advanced Generics',
          enrolledAt: '2024-01-10'
        }
      ]

      setStats(mockStats)
      setRecentCourses(mockCourses)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    {
      title: 'Enrolled Courses',
      value: stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'Active courses'
    },
    {
      title: 'Completed',
      value: stats?.completedCourses || 0,
      icon: Award,
      color: 'bg-green-500',
      description: 'Courses finished'
    },
    {
      title: 'Overall Progress',
      value: `${stats?.totalProgress || 0}%`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      description: 'Learning journey'
    },
    {
      title: 'Learning Hours',
      value: stats?.learningHours || 0,
      icon: Clock,
      color: 'bg-orange-500',
      description: 'Time invested'
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
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
          <p className="text-gray-600 mt-1">
            Continue your learning journey from where you left off
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <PlayCircle className="h-4 w-4 mr-2" />
          Continue Learning
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <Card key={stat.title} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Next: {course.nextLesson}</p>
                      <div className="mt-2">
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    asChild
                  >
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Resume
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Completed lesson', course: 'React Patterns', time: '2 hours ago' },
                { action: 'Earned certificate', course: 'JavaScript Basics', time: '1 day ago' },
                { action: 'Started new course', course: 'Node.js Backend', time: '2 days ago' },
                { action: 'Asked question', course: 'TypeScript Help', time: '3 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">
                      in {activity.course} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/dashboard/courses">
                <div className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900">Browse Courses</p>
                </div>
              </Link>
              
              <Link href="/dashboard/certificates">
                <div className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900">Certificates</p>
                </div>
              </Link>
              
              <Link href="/dashboard/questions">
                <div className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900">Q&A Forum</p>
                </div>
              </Link>
              
              <Link href="/dashboard/profile">
                <div className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 cursor-pointer group">
                  <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-gray-900">Study Plan</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}