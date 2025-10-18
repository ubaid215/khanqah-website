// src/app/admin/courses/[id]/modules/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { getAuthToken } from '@/lib/edge-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  BookOpen,
  Loader2,
  FileText,
  PlayCircle,
  CheckCircle,
  Upload,
  X
} from 'lucide-react'
import { CourseWithRelations, LessonType } from '@/types'

interface ModuleFormData {
  title: string
  description: string
  order: number
}

interface LessonFormData {
  title: string
  description: string
  type: LessonType
  content: string
  videoUrl: string
  duration: number
  order: number
  isFree: boolean
}

export default function CourseModulesPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const [moduleForm, setModuleForm] = useState<ModuleFormData>({
    title: '',
    description: '',
    order: 0
  })

  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: '',
    description: '',
    type: LessonType.VIDEO,
    content: '',
    videoUrl: '',
    duration: 0,
    order: 0,
    isFree: false
  })

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCourseById(courseId)
      
      // Handle ApiResponse format
      if (response && typeof response === 'object' && 'data' in response) {
        setCourse(response.data as CourseWithRelations)
      } else {
        // If it's already the course data directly
        setCourse(response as CourseWithRelations)
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
      alert('Failed to load course data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await apiClient.createModule({
        courseId,
        title: moduleForm.title,
        description: moduleForm.description,
        order: moduleForm.order
      })
      
      // Handle response properly
      if (response && typeof response === 'object') {
        // Check if it's an ApiResponse with success property
        if ('success' in response) {
          if (!response.success) {
            // Handle error from ApiResponse
            const errorMessage = (response as any).error || 'Failed to create module'
            throw new Error(errorMessage)
          }
          // Success case for ApiResponse
          setShowModuleForm(false)
          setModuleForm({ title: '', description: '', order: 0 })
          setEditingModule(null)
          await fetchCourse()
        } else {
          // Direct success case (raw module data)
          setShowModuleForm(false)
          setModuleForm({ title: '', description: '', order: 0 })
          setEditingModule(null)
          await fetchCourse()
        }
      } else {
        // Unknown response format
        throw new Error('Unexpected response format')
      }
    } catch (error: any) {
      console.error('Failed to create module:', error)
      alert(error.message || 'Failed to create module')
    }
  }

  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingModule) return
    
    try {
      const response = await apiClient.updateModule(editingModule, {
        title: moduleForm.title,
        description: moduleForm.description,
        order: moduleForm.order
      })
      
      // Handle response properly
      if (response && typeof response === 'object') {
        if ('success' in response) {
          if (!response.success) {
            const errorMessage = (response as any).error || 'Failed to update module'
            throw new Error(errorMessage)
          }
          setShowModuleForm(false)
          setModuleForm({ title: '', description: '', order: 0 })
          setEditingModule(null)
          await fetchCourse()
        } else {
          setShowModuleForm(false)
          setModuleForm({ title: '', description: '', order: 0 })
          setEditingModule(null)
          await fetchCourse()
        }
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error: any) {
      console.error('Failed to update module:', error)
      alert(error.message || 'Failed to update module')
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedModuleId) {
      alert('Please select a module first')
      return
    }
    
    try {
      console.log('Creating lesson with data:', {
        moduleId: selectedModuleId,
        title: lessonForm.title,
        type: lessonForm.type,
        order: lessonForm.order
      })

      const response = await apiClient.createLesson({
        moduleId: selectedModuleId,
        title: lessonForm.title,
        description: lessonForm.description,
        type: lessonForm.type,
        content: lessonForm.content,
        videoUrl: lessonForm.videoUrl,
        duration: lessonForm.duration,
        order: lessonForm.order,
        isFree: lessonForm.isFree
      })
      
      console.log('Create lesson response:', response)
      
      // Handle response properly
      if (response && typeof response === 'object') {
        if ('success' in response) {
          if (!response.success) {
            const errorMessage = (response as any).error || 'Failed to create lesson'
            throw new Error(errorMessage)
          }
          setShowLessonForm(false)
          resetLessonForm()
          await fetchCourse()
          alert('Lesson created successfully!')
        } else {
          setShowLessonForm(false)
          resetLessonForm()
          await fetchCourse()
          alert('Lesson created successfully!')
        }
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error: any) {
      console.error('Failed to create lesson:', error)
      alert(error.message || 'Failed to create lesson')
    }
  }

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingLesson) return
    
    try {
      const response = await apiClient.updateLesson(editingLesson, {
        title: lessonForm.title,
        description: lessonForm.description,
        type: lessonForm.type,
        content: lessonForm.content,
        videoUrl: lessonForm.videoUrl,
        duration: lessonForm.duration,
        order: lessonForm.order,
        isFree: lessonForm.isFree
      })
      
      // Handle response properly
      if (response && typeof response === 'object') {
        if ('success' in response) {
          if (!response.success) {
            const errorMessage = (response as any).error || 'Failed to update lesson'
            throw new Error(errorMessage)
          }
          setShowLessonForm(false)
          resetLessonForm()
          await fetchCourse()
          alert('Lesson updated successfully!')
        } else {
          setShowLessonForm(false)
          resetLessonForm()
          await fetchCourse()
          alert('Lesson updated successfully!')
        }
      } else {
        throw new Error('Unexpected response format')
      }
    } catch (error: any) {
      console.error('Failed to update lesson:', error)
      alert(error.message || 'Failed to update lesson')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) return
    
    try {
      await apiClient.deleteModule(moduleId)
      await fetchCourse()
      alert('Module deleted successfully!')
    } catch (error: any) {
      console.error('Failed to delete module:', error)
      alert(error.message || 'Failed to delete module')
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return
    
    try {
      await apiClient.deleteLesson(lessonId)
      await fetchCourse()
      alert('Lesson deleted successfully!')
    } catch (error: any) {
      console.error('Failed to delete lesson:', error)
      alert(error.message || 'Failed to delete lesson')
    }
  }

  const handleEditModule = (module: any) => {
    setEditingModule(module.id)
    setModuleForm({
      title: module.title,
      description: module.description || '',
      order: module.order
    })
    setShowModuleForm(true)
  }

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson.id)
    setSelectedModuleId(lesson.moduleId)
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      // FIXED: Handle null duration by providing default value
      duration: lesson.duration || 0,
      order: lesson.order,
      isFree: lesson.isFree || false
    })
    setShowLessonForm(true)
  }

  const handleAddLesson = (moduleId: string) => {
    console.log('Adding lesson to module:', moduleId)
    setSelectedModuleId(moduleId)
    setEditingLesson(null)
    
    // Set default order based on existing lessons in the module
    const module = course?.modules?.find(m => m.id === moduleId)
    const lessonCount = module?.lessons?.length || 0
    setLessonForm(prev => ({
      ...prev,
      order: lessonCount,
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      duration: 0,
      isFree: false
    }))
    
    setShowLessonForm(true)
  }

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      type: LessonType.VIDEO,
      content: '',
      videoUrl: '',
      duration: 0,
      order: 0,
      isFree: false
    })
    setSelectedModuleId(null)
    setEditingLesson(null)
  }

  const handleVideoUpload = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    
    try {
      // Use the new upload method with progress
      const uploadResult = await apiClient.uploadFileWithProgress(
        file, 
        (progress) => {
          setUploadProgress(progress)
        }
      )
      
      setLessonForm(prev => ({ ...prev, videoUrl: uploadResult.url }))
      alert('Video uploaded successfully!')
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert(error.message || 'Video upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Alternative upload method using fetch directly (if API client doesn't work)
  const handleVideoUploadDirect = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    
    try {
      const token = getAuthToken()
      
      if (!token) {
        alert('Please log in to upload files')
        setUploading(false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setLessonForm(prev => ({
          ...prev,
          videoUrl: result.data.url
        }))
        alert('Video uploaded successfully!')
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return <PlayCircle className="h-4 w-4 text-blue-500" />
      case LessonType.ARTICLE:
        return <FileText className="h-4 w-4 text-green-500" />
      case LessonType.QUIZ:
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getLessonTypeLabel = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return 'Video'
      case LessonType.ARTICLE:
        return 'Article'
      case LessonType.QUIZ:
        return 'Quiz'
      default:
        return 'Lesson'
    }
  }

  // FIXED: Handle null duration by providing default value
  const formatDuration = (minutes: number | null) => {
    const duration = minutes || 0
    if (duration < 60) {
      return `${duration} min`
    }
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
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
        <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
        <Button
          onClick={() => router.push('/admin/courses')}
          className="mt-4"
        >
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/courses')}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-1">
              Manage course modules and lessons • {course.modules?.length || 0} modules • {course._count?.lessons || 0} lessons
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => {
            setEditingModule(null)
            setModuleForm({ 
              title: '', 
              description: '', 
              order: course.modules?.length || 0 
            })
            setShowModuleForm(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Module Creation/Edit Form */}
      {showModuleForm && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingModule ? handleUpdateModule : handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title *
                </label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter module title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Module description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <Input
                  type="number"
                  value={moduleForm.order}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!moduleForm.title.trim()}
                >
                  {editingModule ? 'Update Module' : 'Create Module'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModuleForm(false)
                    setEditingModule(null)
                    setModuleForm({ title: '', description: '', order: 0 })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lesson Creation/Edit Form */}
      {showLessonForm && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Module:</strong> {course.modules?.find(m => m.id === selectedModuleId)?.title || 'Unknown Module'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title *
                </label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Lesson description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Type
                </label>
                <select
                  value={lessonForm.type}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, type: e.target.value as LessonType }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={LessonType.VIDEO}>Video</option>
                  <option value={LessonType.ARTICLE}>Article</option>
                  <option value={LessonType.QUIZ}>Quiz</option>
                </select>
              </div>

              {lessonForm.type === LessonType.VIDEO && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Video Upload
                  </label>
                  
                  {lessonForm.videoUrl ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <PlayCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-800">Video uploaded successfully</span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLessonForm(prev => ({ ...prev, videoUrl: '' }))}
                        className="text-red-600 hover:text-red-700 border-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // Validate file size (50MB max)
                            if (file.size > 50 * 1024 * 1024) {
                              alert('Video file must be less than 50MB')
                              return
                            }
                            // Try API client first, fallback to direct upload
                            handleVideoUpload(file).catch(() => {
                              handleVideoUploadDirect(file)
                            })
                          }
                        }}
                        className="hidden"
                        id="video-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="video-upload"
                        className={`cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {uploading ? `Uploading... ${uploadProgress}%` : 'Click to upload video'}
                          </p>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 50MB</p>
                        </div>
                      </label>
                      {uploading && (
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter video URL
                    </label>
                    <Input
                      value={lessonForm.videoUrl}
                      onChange={(e) => setLessonForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                </div>
              )}

              {lessonForm.type === LessonType.ARTICLE && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <Textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Lesson content in markdown format"
                    rows={6}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <Input
                    type="number"
                    value={lessonForm.order}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={lessonForm.isFree}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, isFree: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                  Free lesson (available without enrollment)
                </label>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!lessonForm.title.trim() || uploading || !selectedModuleId}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : editingLesson ? (
                    'Update Lesson'
                  ) : (
                    'Create Lesson'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLessonForm(false)
                    resetLessonForm()
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Modules List */}
      <div className="space-y-4">
        {course.modules && course.modules.length > 0 ? (
          course.modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
            <Card key={module.id} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {module.title}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Order: {module.order} • {module.lessons?.length || 0} lessons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                      onClick={() => handleEditModule(module)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteModule(module.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {module.description && (
                  <p className="text-gray-600 mt-2">{module.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons && module.lessons.length > 0 ? (
                    module.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          {getLessonIcon(lesson.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Free
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span className="capitalize">{getLessonTypeLabel(lesson.type)}</span>
                              {/* FIXED: Handle null duration */}
                              {lesson.duration && lesson.duration > 0 && (
                                <span>{formatDuration(lesson.duration)}</span>
                              )}
                              <span>Order: {lesson.order}</span>
                              {lesson.videoUrl && (
                                <span className="text-blue-600">Video Ready</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-300"
                            onClick={() => handleEditLesson(lesson)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-300 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No lessons in this module yet
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-700"
                    onClick={() => handleAddLesson(module.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-500 mb-4">
                Start by creating your first module to organize your course content
              </p>
              <Button
                onClick={() => {
                  setEditingModule(null)
                  setModuleForm({ title: '', description: '', order: 0 })
                  setShowModuleForm(true)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}