// src/app/dashboard/courses/[slug]/page.tsx
'use client'

import { useState, useEffect } from 'react'
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
  BarChart3,
  Lock,
  AlertCircle,
  Award,
  ChevronDown
} from 'lucide-react'
import { CourseWithRelations } from '@/types'
import { Enrollment, Module, Lesson, LessonProgress } from '@prisma/client'

interface ModuleWithLessons extends Module {
  lessons: (Lesson & { progress?: LessonProgress | null })[]
}

interface CourseWithProgress extends CourseWithRelations {
  modules: ModuleWithLessons[]
  enrollment?: Enrollment
}

export default function DashboardCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [course, setCourse] = useState<CourseWithProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [updatingLesson, setUpdatingLesson] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get the slug from params and ensure it's a string
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  useEffect(() => {
    console.log('🔍 Page - Params:', params)
    console.log('🔍 Page - Slug:', slug)
    console.log('🔍 Page - URL:', window.location.pathname)
    
    if (slug && slug !== 'undefined') {
      fetchCourse()
    } else {
      setIsLoading(false)
      setError('Invalid course URL - slug parameter is missing')
      console.error('❌ Invalid slug:', slug)
    }
  }, [slug])

  const fetchCourse = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🚀 Fetching course for slug:', slug)

      // Validate slug before making API call
      if (!slug || slug === 'undefined') {
        throw new Error('Course slug is required')
      }

      // Fetch course by slug
      const courseData = await apiClient.getCourseBySlug(slug)
      console.log('✅ Course data received:', courseData)
      
      if (!courseData) {
        throw new Error('Course not found')
      }

      // Fetch enrollment data
      let enrollment = null
      try {
        enrollment = await apiClient.getUserEnrollment(courseData.id)
        console.log('✅ Enrollment data:', enrollment)
      } catch (error) {
        console.log('ℹ️ No enrollment found for this course')
        // User is not enrolled, which is fine
      }

      // Fetch lesson progress for all lessons
      const modulesWithProgress = await Promise.all(
        (courseData.modules || []).map(async (module) => {
          const lessonsWithProgress = await Promise.all(
            module.lessons.map(async (lesson) => {
              try {
                const progress = await apiClient.getLessonProgress(lesson.id)
                return { ...lesson, progress }
              } catch {
                return { ...lesson, progress: null }
              }
            })
          )
          return { ...module, lessons: lessonsWithProgress }
        })
      )

      setCourse({
        ...courseData,
        modules: modulesWithProgress,
        enrollment: enrollment || undefined
      })

      // Expand first module by default
      if (modulesWithProgress.length > 0) {
        setExpandedModules(new Set([modulesWithProgress[0].id]))
      }
    } catch (error: any) {
      console.error('❌ Failed to fetch course:', error)
      setError(error.message || 'Failed to load course')
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
    // Navigate to lesson player
    router.push(`/dashboard/courses/${slug}/${lesson.id}`)
  }

  const toggleLessonCompletion = async (lessonId: string, currentStatus: boolean) => {
    try {
      setUpdatingLesson(lessonId)
      await apiClient.updateLessonProgress({
        lessonId,
        isCompleted: !currentStatus
      })
      // Refresh course data
      await fetchCourse()
    } catch (error: any) {
      console.error('Failed to update lesson:', error)
      alert(error.message || 'Failed to update lesson progress')
    } finally {
      setUpdatingLesson(null)
    }
  }

  const calculateCourseProgress = () => {
    if (!course?.modules) return 0
    
    const totalLessons = course.modules.reduce((total, module) => 
      total + module.lessons.length, 0
    )
    const completedLessons = course.modules.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.progress?.isCompleted).length, 0
    )
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const getTotalDuration = () => {
    if (!course?.modules) return 0
    return course.modules.reduce((total, module) => 
      total + module.lessons.reduce((moduleTotal, lesson) => 
        moduleTotal + (lesson.duration || 0), 0
      ), 0
    )
  }

  const getCompletedLessons = () => {
    if (!course?.modules) return 0
    return course.modules.reduce((total, module) => 
      total + module.lessons.filter(lesson => lesson.progress?.isCompleted).length, 0
    )
  }

  const getTotalLessons = () => {
    if (!course?.modules) return 0
    return course.modules.reduce((total, module) => total + module.lessons.length, 0)
  }

  const canAccessLesson = (lesson: Lesson) => {
    return lesson.isFree || course?.enrollment
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error ? 'Error Loading Course' : 'Course not found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'The course you are looking for does not exist.'}
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/dashboard/courses')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Back to Courses
              </Button>
              <Button 
                variant="outline" 
                onClick={fetchCourse}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const courseProgress = calculateCourseProgress()
  const totalDuration = getTotalDuration()
  const completedLessons = getCompletedLessons()
  const totalLessons = getTotalLessons()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/dashboard/courses')}
            className="border-gray-300 mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1 line-clamp-2">{course.description}</p>
          </div>
        </div>
        {courseProgress === 100 && (
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Award className="h-4 w-4 mr-2" />
            Get Certificate
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Your Progress
                </h3>
                <span className="text-sm font-bold text-blue-600 bg-white px-3 py-1 rounded-full">
                  {courseProgress}% Complete
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${courseProgress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="text-xs">Duration</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span className="text-xs">Completed</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {completedLessons}/{totalLessons}
                  </span>
                </div>
                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span className="text-xs">Modules</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {course.modules?.length || 0}
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
              <div className="space-y-3">
                {course.modules?.map((module) => {
                  const moduleCompleted = module.lessons.filter(l => l.progress?.isCompleted).length
                  const moduleTotal = module.lessons.length
                  const moduleProgress = moduleTotal > 0 ? (moduleCompleted / moduleTotal) * 100 : 0

                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            <ChevronDown 
                              className={`h-5 w-5 text-gray-400 transition-transform ${
                                expandedModules.has(module.id) ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{moduleTotal} lessons</span>
                            <span>•</span>
                            <span>
                              {Math.floor(module.lessons.reduce((total, lesson) => 
                                total + (lesson.duration || 0), 0) / 60)}min
                            </span>
                            <span>•</span>
                            <span className="text-blue-600 font-medium">
                              {moduleCompleted}/{moduleTotal} completed
                            </span>
                          </div>
                          {/* Module progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${moduleProgress}%` }}
                            />
                          </div>
                        </div>
                      </button>
                      
                      {expandedModules.has(module.id) && (
                        <div className="p-4 space-y-2 bg-white">
                          {module.lessons.map((lesson) => {
                            const isCompleted = lesson.progress?.isCompleted || false
                            const hasAccess = canAccessLesson(lesson)

                            return (
                              <div
                                key={lesson.id}
                                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                  isCompleted 
                                    ? 'border-green-200 bg-green-50' 
                                    : hasAccess
                                    ? 'border-gray-200 bg-white hover:bg-gray-50 hover:border-blue-200'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`p-2 rounded-full flex-shrink-0 ${
                                    isCompleted 
                                      ? 'bg-green-100 text-green-600' 
                                      : hasAccess
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {!hasAccess ? (
                                      <Lock className="h-4 w-4" />
                                    ) : isCompleted ? (
                                      <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                      <PlayCircle className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className={`font-medium ${hasAccess ? 'text-gray-900' : 'text-gray-500'}`}>
                                      {lesson.title}
                                    </h5>
                                    <p className="text-sm text-gray-600 flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      {lesson.duration ? `${Math.floor(lesson.duration / 60)}:${String(lesson.duration % 60).padStart(2, '0')}` : 'N/A'}
                                      <span>•</span>
                                      <span className="capitalize">{lesson.type.toLowerCase()}</span>
                                      {lesson.isFree && (
                                        <>
                                          <span>•</span>
                                          <span className="text-green-600 font-medium">Free Preview</span>
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {hasAccess && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          toggleLessonCompletion(lesson.id, isCompleted)
                                        }}
                                        disabled={updatingLesson === lesson.id}
                                        className={`${
                                          isCompleted 
                                            ? 'border-green-200 text-green-600 hover:bg-green-50' 
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                      >
                                        {updatingLesson === lesson.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : isCompleted ? (
                                          <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                          <div className="h-3 w-3 border-2 border-gray-400 rounded-full" />
                                        )}
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleLessonClick(lesson)
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <PlayCircle className="h-3 w-3 mr-1" />
                                        {isCompleted ? 'Review' : 'Start'}
                                      </Button>
                                    </>
                                  )}
                                  {!hasAccess && (
                                    <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                      Enroll to access
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Info */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Course Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <span className="text-gray-600 text-sm">Level</span>
                <span className="font-semibold text-gray-900">{course.level}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <span className="text-gray-600 text-sm">Duration</span>
                <span className="font-semibold text-gray-900">
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <span className="text-gray-600 text-sm">Total Lessons</span>
                <span className="font-semibold text-gray-900">{totalLessons}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                <span className="text-gray-600 text-sm">Modules</span>
                <span className="font-semibold text-gray-900">{course.modules?.length || 0}</span>
              </div>
              {course.enrollment && (
                <div className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg">
                  <span className="text-gray-600 text-sm">Enrolled</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(course.enrollment.enrolledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievement Card */}
          {courseProgress === 100 ? (
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Congratulations! 🎉</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You've completed this course. Get your certificate now!
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Award className="h-4 w-4 mr-2" />
                  Get Certificate
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Keep Going!</h3>
                    <p className="text-sm text-gray-600">
                      {Math.round((totalLessons - completedLessons) * 0.5)} hours left
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Lessons remaining:</span>
                    <span className="font-semibold text-gray-900">
                      {totalLessons - completedLessons}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated time:</span>
                    <span className="font-semibold text-gray-900">
                      {Math.ceil((totalLessons - completedLessons) * 0.5)} hours
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/courses/${slug}`)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Course Details
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Find first incomplete lesson
                  for (const module of course.modules || []) {
                    const firstIncomplete = module.lessons.find(l => !l.progress?.isCompleted)
                    if (firstIncomplete) {
                      handleLessonClick(firstIncomplete)
                      return
                    }
                  }
                  // If all lessons are completed, go to first lesson
                  if (course.modules?.[0]?.lessons?.[0]) {
                    handleLessonClick(course.modules[0].lessons[0])
                  }
                }}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                {completedLessons === 0 ? 'Start Learning' : 'Continue Learning'}
              </Button>
              {courseProgress === 100 && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Instructor Info */}
          {(course as any).instructor && (
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <img
                    src={(course as any).instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((course as any).instructor.name)}&size=64`}
                    alt={(course as any).instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {(course as any).instructor.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {(course as any).instructor.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}