// src/app/admin/courses/[id]/modules/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  BookOpen,
  Loader2
} from 'lucide-react'
import { CourseWithRelations, ModuleWithLessons } from '@/types'

export default function CourseModulesPage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<CourseWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 0
  })

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await apiClient.getCourseById(courseId)
      if (response.success) {
        setCourse(response)
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await apiClient.createModule({
        courseId,
        title: moduleForm.title,
        description: moduleForm.description,
        order: moduleForm.order
      })
      
      setShowModuleForm(false)
      setModuleForm({ title: '', description: '', order: 0 })
      fetchCourse() // Refresh course data
    } catch (error: any) {
      console.error('Failed to create module:', error)
      alert(error.message || 'Failed to create module')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) return
    
    try {
      // You'll need to add deleteModule method to apiClient
      // await apiClient.deleteModule(moduleId)
      fetchCourse() // Refresh course data
    } catch (error: any) {
      console.error('Failed to delete module:', error)
      alert(error.message || 'Failed to delete module')
    }
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
              Manage course modules and lessons
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => setShowModuleForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {/* Module Creation Form */}
      {showModuleForm && (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Title *
                </label>
                <Input
                  value={moduleForm.title}
                  onChange={(e: { target: { value: any } }) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
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
                  onChange={(e: { target: { value: any } }) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
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
                  onChange={(e: { target: { value: string } }) => setModuleForm(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
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

      {/* Modules List */}
      <div className="space-y-4">
        {course.modules?.map((module) => (
          <Card key={module.id} className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <CardTitle className="text-lg font-semibold">
                    {module.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300"
                    onClick={() => {
                      setEditingModule(module.id)
                      setModuleForm({
                        title: module.title,
                        description: module.description || '',
                        order: module.order
                      })
                      setShowModuleForm(true)
                    }}
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
                {module.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <span className="font-medium text-gray-900">{lesson.title}</span>
                      <span className="text-sm text-gray-500 capitalize">{lesson.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-300">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-gray-300 text-gray-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}