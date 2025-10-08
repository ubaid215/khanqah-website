// src/app/dashboard/courses/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users,
  PlayCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { CourseWithProgress } from '@/types'

export default function DashboardCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<CourseWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUserCourses()
  }, [])

  const fetchUserCourses = async () => {
    try {
      const response = await apiClient.getUserEnrollments()
      if (response.success) {
        setCourses(response.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch user courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseClick = (courseId: string) => {
    router.push(`/dashboard/courses/${courseId}`)
  }

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200'
    if (progress < 50) return 'bg-red-500'
    if (progress < 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-purple-100 text-purple-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600 mt-1">
            Continue your learning journey
          </p>
        </div>
      </div>

      {/* Search */}
      <Card className="bg-blue-50 border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
            <Input
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-blue-200 focus:border-blue-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
            <Button 
              onClick={() => router.push('/courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id}
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-blue-200"
              onClick={() => handleCourseClick(course.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {course.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(course.progress || 0)}`}
                      style={{ width: `${course.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{course.totalLessons || 0} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      <span>{course.completedLessons || 0} completed</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    {course.progress === 100 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}