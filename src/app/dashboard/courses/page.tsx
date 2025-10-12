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
  BarChart3,
  AlertCircle
} from 'lucide-react'
import { Enrollment } from '@prisma/client'

interface EnrollmentWithCourse extends Enrollment {
  course: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail: string | null
    level: string
    modules: {
      id: string
      lessons: {
        id: string
        title: string
        duration: number | null
      }[]
    }[]
  }
  _count?: {
    completedLessons: number
  }
}

export default function DashboardCoursesPage() {
  const router = useRouter()
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserCourses()
  }, [])

  const fetchUserCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const enrollmentsData = await apiClient.getUserEnrollments()
      setEnrollments(enrollmentsData || [])
    } catch (error: any) {
      console.error('Failed to fetch user courses:', error)
      setError(error.message || 'Failed to load your courses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseClick = (courseSlug: string) => {
    router.push(`/dashboard/courses/${courseSlug}`)
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

  const calculateTotalLessons = (course: EnrollmentWithCourse['course']) => {
    return course.modules?.reduce((total, module) => total + module.lessons.length, 0) || 0
  }

  const calculateCourseDuration = (course: EnrollmentWithCourse['course']) => {
    const totalMinutes = course.modules?.reduce((total, module) => {
      return total + module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)
    }, 0) || 0
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.course.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Courses</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={fetchUserCourses}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
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
        <Button
          onClick={() => router.push('/courses')}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Browse Courses
        </Button>
      </div>

      {/* Stats Overview */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Courses</p>
                  <p className="text-3xl font-bold text-blue-900 mt-1">{enrollments.length}</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-900 mt-1">
                    {enrollments.filter(e => e.status === 'COMPLETED').length}
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">In Progress</p>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    {enrollments.filter(e => e.status === 'ACTIVE' && e.progress < 100).length}
                  </p>
                </div>
                <PlayCircle className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
      {filteredEnrollments.length === 0 ? (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {enrollments.length === 0 ? 'No courses yet' : 'No courses found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {enrollments.length === 0 
                ? 'Start your learning journey by enrolling in a course'
                : 'Try adjusting your search terms'
              }
            </p>
            {enrollments.length === 0 && (
              <Button 
                onClick={() => router.push('/courses')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Browse Courses
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => {
            const totalLessons = calculateTotalLessons(enrollment.course)
            const completedLessons = enrollment._count?.completedLessons || 0
            const progress = enrollment.progress || 0

            return (
              <Card 
                key={enrollment.id}
                className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-200 group"
                onClick={() => handleCourseClick(enrollment.course.slug)}
              >
                {/* Course Thumbnail */}
                {enrollment.course.thumbnail && (
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(enrollment.course.level)}`}>
                        {enrollment.course.level}
                      </span>
                    </div>
                    {enrollment.status === 'COMPLETED' && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {enrollment.course.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {enrollment.course.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{calculateCourseDuration(enrollment.course)}</span>
                      </div>
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        <span>{completedLessons}/{totalLessons}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCourseClick(enrollment.course.slug)
                    }}
                  >
                    {enrollment.status === 'COMPLETED' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Review Course
                      </>
                    ) : progress === 0 ? (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Start Learning
                      </>
                    ) : (
                      <>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}