'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  Loader2,
  BookOpen
} from 'lucide-react'
import { CourseWithRelations, CourseLevel, CourseStatus } from '@/types'

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [course, setCourse] = useState<CourseWithRelations | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDesc: '',
    thumbnail: '',
    level: CourseLevel.BEGINNER,
    price: 0,
    isFree: true,
    status: CourseStatus.DRAFT
  })

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const response = await apiClient.getCourseById(courseId)
      
      // Fixed: Handle different response structures
      const courseData = response.data || response
      
      if (courseData) {
        setCourse(courseData)
        setFormData({
          title: courseData.title || '',
          slug: courseData.slug || '',
          description: courseData.description || '',
          shortDesc: courseData.shortDesc || '',
          thumbnail: courseData.thumbnail || '',
          level: courseData.level || CourseLevel.BEGINNER,
          price: courseData.price ? parseFloat(courseData.price.toString()) : 0,
          isFree: courseData.isFree ?? true,
          status: courseData.status || CourseStatus.DRAFT
        })
        
        // Set categories from response
        if (courseData.categories) {
          setCategories(courseData.categories.map((cat: any) => 
            cat.category?.name || cat.name || ''
          ).filter(Boolean))
        }
      }
    } catch (error) {
      console.error('Failed to fetch course:', error)
      alert('Failed to load course')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData = {
        ...formData,
        categoryIds: [] // You'll need to get category IDs
      }
      
      const response = await apiClient.updateCourse(courseId, updateData)
      
      // Fixed: Check for success based on your API response
      if (response) {
        router.push('/admin/courses')
      } else {
        throw new Error('Failed to update course')
      }
    } catch (error: any) {
      console.error('Failed to update course:', error)
      alert(error.message || 'Failed to update course')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()])
      setNewCategory('')
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove))
  }

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this course?')) return
    
    try {
      await apiClient.updateCourse(courseId, {
        status: CourseStatus.PUBLISHED,
        isPublished: true
      })
      router.push('/admin/courses')
    } catch (error: any) {
      console.error('Failed to publish course:', error)
      alert(error.message || 'Failed to publish course')
    }
  }

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (!token) {
        alert('Please log in to upload files')
        return
      }

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData,
      })

      const result = await response.json()

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          thumbnail: result.data.url
        }))
      } else {
        alert(result.error || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      // Reset the file input
      event.target.value = ''
    }
  }

  if (isFetching) {
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
            onClick={() => router.back()}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
            <p className="text-gray-600 mt-1">
              Update course information and settings
            </p>
          </div>
        </div>
        
        {course.status !== CourseStatus.PUBLISHED && (
          <Button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Publish Course
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="course-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <Textarea
                    value={formData.shortDesc}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDesc: e.target.value }))}
                    placeholder="Brief description of the course"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of the course content"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCategory()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-2 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Settings */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CourseStatus }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={CourseStatus.DRAFT}>Draft</option>
                    <option value={CourseStatus.PUBLISHED}>Published</option>
                    <option value={CourseStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as CourseLevel }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={CourseLevel.BEGINNER}>Beginner</option>
                    <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                    <option value={CourseLevel.ADVANCED}>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isFree}
                        onChange={() => setFormData(prev => ({ ...prev, isFree: true, price: 0 }))}
                        className="mr-2"
                      />
                      Free
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.isFree}
                        onChange={() => setFormData(prev => ({ ...prev, isFree: false }))}
                        className="mr-2"
                      />
                      Paid
                    </label>
                    {!formData.isFree && (
                      <div className="ml-6">
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload course thumbnail
                  </p>
                  <input
                    type="file"
                    id="thumbnail-upload"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300"
                    >
                      Choose File
                    </Button>
                  </label>
                </div>
                {formData.thumbnail && (
                  <div className="mt-4">
                    <img
                      src={formData.thumbnail}
                      alt="Course thumbnail"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Update Course
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.push('/admin/courses')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}