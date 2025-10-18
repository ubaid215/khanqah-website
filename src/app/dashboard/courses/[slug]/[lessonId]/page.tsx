// src/app/dashboard/courses/[slug]/[lessonId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft, 
  PlayCircle, 
  CheckCircle2, 
  Loader2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface LessonWithProgress {
  id: string
  title: string
  description?: string | null // FIXED: Allow null
  type: string
  content?: string | null // FIXED: Allow null
  videoUrl?: string | null // FIXED: Allow null
  duration?: number | null // FIXED: Allow null
  order: number
  isFree: boolean
  progress?: {
    isCompleted: boolean
    watchedDuration: number
    lastPosition: number
  } | null
}

interface ModuleWithLessons {
  id: string
  title: string
  lessons: LessonWithProgress[]
}

export default function DashboardLessonPage() {
  const params = useParams()
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonWithProgress | null>(null)
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)

  const slug = params.slug as string
  const lessonId = params.lessonId as string

  useEffect(() => {
    fetchLessonData()
  }, [slug, lessonId])

  const fetchLessonData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔍 Fetching lesson data:', { slug, lessonId })

      // Fetch course by slug to get all lessons
      const courseData = await apiClient.getCourseBySlug(slug)
      console.log('✅ Course data:', courseData)

      if (!courseData) {
        throw new Error('Course not found')
      }

      setCourse(courseData)

      // Find the specific lesson in all modules
      let targetLesson: LessonWithProgress | null = null
      for (const module of courseData.modules || []) {
        const foundLesson = module.lessons.find((l: any) => l.id === lessonId)
        if (foundLesson) {
          // Try to get lesson progress
          try {
            const progress = await apiClient.getLessonProgress(foundLesson.id)
            targetLesson = { ...foundLesson, progress }
          } catch {
            targetLesson = { ...foundLesson, progress: null }
          }
          break
        }
      }

      if (!targetLesson) {
        throw new Error('Lesson not found')
      }

      setLesson(targetLesson)
    } catch (error: any) {
      console.error('❌ Failed to fetch lesson:', error)
      setError(error.message || 'Failed to load lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLessonCompletion = async () => {
    if (!lesson) return

    try {
      setIsCompleting(true)
      const currentStatus = lesson.progress?.isCompleted || false
      await apiClient.updateLessonProgress({
        lessonId: lesson.id,
        isCompleted: !currentStatus
      })
      // Refresh lesson data
      await fetchLessonData()
    } catch (error: any) {
      console.error('Failed to update lesson:', error)
      alert(error.message || 'Failed to update lesson progress')
    } finally {
      setIsCompleting(false)
    }
  }

  const getNextLesson = () => {
    if (!course?.modules) return null

    const allLessons = course.modules.flatMap((module: ModuleWithLessons) => module.lessons)
    const currentIndex = allLessons.findIndex((l: LessonWithProgress) => l.id === lessonId)
    
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1]
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!course?.modules) return null

    const allLessons = course.modules.flatMap((module: ModuleWithLessons) => module.lessons)
    const currentIndex = allLessons.findIndex((l: LessonWithProgress) => l.id === lessonId)
    
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1]
    }
    return null
  }

  const navigateToLesson = (targetLesson: LessonWithProgress) => {
    router.push(`/dashboard/courses/${slug}/${targetLesson.id}`)
  }

  // FIXED: Handle null duration
  const formatDuration = (duration?: number | null) => {
    if (!duration) return 'N/A'
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson || !course) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error ? 'Error Loading Lesson' : 'Lesson not found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'The lesson you are looking for does not exist.'}
            </p>
            <Button 
              onClick={() => router.push(`/dashboard/courses/${slug}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const nextLesson = getNextLesson()
  const previousLesson = getPreviousLesson()
  const isCompleted = lesson.progress?.isCompleted || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${slug}`)}
            className="border-gray-300 mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600 mt-1">{course.title}</p>
          </div>
        </div>
        <Button
          onClick={toggleLessonCompletion}
          disabled={isCompleting}
          className={`${
            isCompleted 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isCompleting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : isCompleted ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          )}
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lesson Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Lesson Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Video Player */}
              {lesson.videoUrl && (
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full"
                    poster={course.thumbnail || undefined}
                  >
                    <source src={lesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {/* Lesson Info */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {formatDuration(lesson.duration)}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900 capitalize">
                    {lesson.type.toLowerCase()}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  isCompleted ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'
                }`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Lesson Description */}
              {lesson.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                </div>
              )}

              {/* Lesson Content */}
              {lesson.content && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
                  <div 
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              )}

              {!lesson.videoUrl && !lesson.content && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Available</h3>
                  <p className="text-gray-600">This lesson doesn't have any content yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Navigation */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Lesson Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {previousLesson && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigateToLesson(previousLesson)}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
              )}
              
              {nextLesson && (
                <Button
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigateToLesson(nextLesson)}
                >
                  Next Lesson
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}

              {!nextLesson && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => router.push(`/dashboard/courses/${slug}`)}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Back to Course Overview
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Status</span>
                  <span className={`font-semibold ${
                    isCompleted ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Duration</span>
                  <span className="font-semibold text-gray-900">
                    {formatDuration(lesson.duration)}
                  </span>
                </div>
                {lesson.progress && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Time Watched</span>
                    <span className="font-semibold text-gray-900">
                      {Math.floor(lesson.progress.watchedDuration / 60)}m
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}