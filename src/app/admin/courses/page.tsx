'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react'
import { CourseWithRelations, CourseStatus, CourseLevel } from '@/types'

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<CourseWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchCourses()
  }, [statusFilter])

  const fetchCourses = async () => {
  try {
    const response = await apiClient.getCourses({ 
      status: statusFilter === 'all' ? undefined : statusFilter as CourseStatus
    })
    
    // Fixed: Properly handle the PaginatedResponse structure with proper typing
    if (response && response.success) {
      // Handle different possible response structures
      if (Array.isArray(response.data)) {
        setCourses(response.data as CourseWithRelations[])
      } else if (response.data && Array.isArray((response.data as any).courses)) {
        setCourses((response.data as any).courses as CourseWithRelations[])
      } else if (response.data && Array.isArray((response.data as any).data)) {
        setCourses((response.data as any).data as CourseWithRelations[])
      } else if (Array.isArray(response)) {
        // Fallback: if response is directly an array
        setCourses(response as CourseWithRelations[])
      } else {
        console.warn('Unexpected response structure:', response)
        setCourses([])
      }
    } else {
      console.warn('API response indicates failure:', response)
      setCourses([])
    }
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    setCourses([])
  } finally {
    setIsLoading(false)
  }
}

  const handleAddNewCourse = () => {
    router.push('/admin/courses/create')
  }

  const handleEditCourse = (courseId: string) => {
    router.push(`/admin/courses/${courseId}/edit`)
  }

  const handleManageModules = (courseId: string) => {
    router.push(`/admin/courses/${courseId}/modules`)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    
    try {
      await apiClient.deleteCourse(courseId)
      setCourses(courses.filter(course => course.id !== courseId))
    } catch (error: any) {
      console.error('Failed to delete course:', error)
      alert(error.message || 'Failed to delete course')
    }
  }

  const handlePublishCourse = async (courseId: string) => {
    try {
      await apiClient.updateCourse(courseId, {
        status: CourseStatus.PUBLISHED,
        isPublished: true,
        categoryIds: undefined
      })
      await fetchCourses() // Refresh the list
    } catch (error: any) {
      console.error('Failed to publish course:', error)
      alert(error.message || 'Failed to publish course')
    }
  }

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED: return 'bg-green-100 text-green-800'
      case CourseStatus.DRAFT: return 'bg-yellow-100 text-yellow-800'
      case CourseStatus.ARCHIVED: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER: return 'bg-blue-100 text-blue-800'
      case CourseLevel.INTERMEDIATE: return 'bg-purple-100 text-purple-800'
      case CourseLevel.ADVANCED: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-1">
            Create, edit, and manage your courses
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleAddNewCourse}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value={CourseStatus.DRAFT}>Draft</option>
              <option value={CourseStatus.PUBLISHED}>Published</option>
              <option value={CourseStatus.ARCHIVED}>Archived</option>
            </select>
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={fetchCourses}
            >
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Courses ({filteredCourses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                <p className="text-gray-500 mt-1">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Get started by creating your first course'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleAddNewCourse}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                )}
              </div>
            ) : (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                          {course.status.toLowerCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(course.level)}`}>
                          {course.level.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {course.shortDesc || course.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{course._count?.enrollments || 0} students</span>
                        <span>{course._count?.modules || 0} modules</span>
                        <span>{course._count?.lessons || 0} lessons</span>
                        <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300"
                      onClick={() => handleManageModules(course.id)}
                    >
                      Modules
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300"
                      onClick={() => handleEditCourse(course.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {course.status !== CourseStatus.PUBLISHED && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-300 text-green-600 hover:text-green-700"
                        onClick={() => handlePublishCourse(course.id)}
                      >
                        Publish
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}