// src/app/dashboard/courses/[id]/page.tsx
'use client'

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  Clock, 
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Users,
  BarChart3
} from 'lucide-react'
import { CourseWithModules } from '@/types'

interface Lesson {
  id: string
  title: string
  description?: string
  type: string
  duration: number
  isFree: boolean
  isCompleted: boolean
  order: number
}

interface Module {
  id: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<CourseWithModules | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const courseId = params.id as string

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await apiClient.getCourse(courseId)
      if (response.success) {
        setCourse(response.data)
        // Expand first module by default
        if (response.data.modules && response.data.modules.length > 0) {
          setExpandedModules(new Set([response.data.modules[0].id]))
        }
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson)
    // In a real app, you'd navigate to the lesson player
    // router.push(`/dashboard/courses/${courseId}/lessons/${lesson.id}`)
  }

  const markLessonComplete = async (lessonId: string) => {
    try {
      await apiClient.updateLessonProgress({
        lessonId,
        isCompleted: true
      })
      // Refresh course data
      fetchCourse()
    } catch (error) {
      console.error('Failed to mark lesson complete:', error)
    }
  }

  const calculateCourseProgress = () => {
    if (!course?.modules) return 0
    
    const totalLessons = course.modules.reduce((total: any, module: { lessons: string | any[] }) => 
      total + module.lessons.length, 0
    )
    const completedLessons = course.modules.reduce((total: any, module: { lessons: { filter: (arg0: (lesson: any) => any) => { (): any; new(): any; length: any } } }) => 
      total + module.lessons.filter((lesson: { isCompleted: any }) => lesson.isCompleted).length, 0
    )
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const getTotalDuration = () => {
    if (!course?.modules) return 0
    return course.modules.reduce((total: any, module: { lessons: any[] }) => 
      total + module.lessons.reduce((moduleTotal: any, lesson: { duration: any }) => 
        moduleTotal + lesson.duration, 0
      ), 0
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Course not found</h3>
        <Button onClick={() => router.push('/dashboard/courses')}>
          Back to Courses
        </Button>
      </div>
    )
  }

  const courseProgress = calculateCourseProgress()
  const totalDuration = getTotalDuration()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/dashboard/courses')}
          className="border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your Progress</h3>
                <span className="text-sm font-medium text-blue-600">{courseProgress}% Complete</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{Math.round(totalDuration / 60)}h total</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span>
                    {course.modules?.reduce((total: any, module: { lessons: { filter: (arg0: (l: any) => any) => { (): any; new(): any; length: any } } }) => 
                      total + module.lessons.filter((l: { isCompleted: any }) => l.isCompleted).length, 0
                    )} of {course.modules?.reduce((total: any, module: { lessons: string | any[] }) => 
                      total + module.lessons.length, 0
                    )} lessons completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Curriculum */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules?.map((module: { id: Key | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; lessons: any[] }) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {module.lessons.length} lessons •{' '}
                          {Math.round(module.lessons.reduce((total: any, lesson: { duration: any }) => total + lesson.duration, 0) / 60)}min
                        </p>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          expandedModules.has(module.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedModules.has(module.id) && (
                      <div className="p-4 space-y-3">
                        {module.lessons.map((lesson: Lesson) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              lesson.isCompleted 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div className={`p-2 rounded-full ${
                                lesson.isCompleted 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}>
                                {lesson.isCompleted ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <PlayCircle className="h-4 w-4" />
                                )}
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                <p className="text-sm text-gray-600">
                                  {Math.round(lesson.duration / 60)}min • {lesson.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {!lesson.isCompleted && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markLessonComplete(lesson.id)}
                                  className="border-green-200 text-green-600 hover:bg-green-50"
                                >
                                  Mark Complete
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => handleLessonClick(lesson)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Start
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card className="bg-purple-50 border-purple-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Course Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Level</span>
                <span className="font-medium text-gray-900">{course.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">{Math.round(totalDuration / 60)} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons</span>
                <span className="font-medium text-gray-900">
                  {course.modules?.reduce((total: any, module: { lessons: string | any[] }) => total + module.lessons.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Modules</span>
                <span className="font-medium text-gray-900">{course.modules?.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Continue Learning */}
          {activeLesson && (
            <Card className="bg-green-50 border-green-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Continue Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">{activeLesson.title}</h4>
                  <p className="text-sm text-gray-600">
                    {Math.round(activeLesson.duration / 60)}min • {activeLesson.type}
                  </p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleLessonClick(activeLesson)}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Continue Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}