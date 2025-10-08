// src/controllers/CourseController.ts
import { NextRequest, NextResponse } from 'next/server'
import { CourseModel } from '@/models/Course'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { CourseLevel, CourseStatus, UserRole } from '@prisma/client'

export class CourseController {
  static async createCourse(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { 
        title, 
        slug, 
        description, 
        shortDesc, 
        thumbnail, 
        level, 
        price, 
        isFree, 
        categoryIds 
      } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!title) validationErrors.title = 'Title is required'
      if (!slug) validationErrors.slug = 'Slug is required'
      if (!description) validationErrors.description = 'Description is required'
      
      if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        validationErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const course = await CourseModel.create({
        title,
        slug,
        description,
        shortDesc,
        thumbnail,
        level,
        price,
        isFree,
        categoryIds
      })

      return ApiResponse.success(
        course,
        'Course created successfully',
        201
      )
    } catch (error: any) {
      console.error('Create course error:', error)
      
      if (error.message.includes('Unique constraint')) {
        return ApiResponse.error('Course with this slug already exists', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async getCourse(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
      const course = await CourseModel.findBySlug(params.slug)
      if (!course) {
        return ApiResponse.error('Course not found', 404)
      }

      // Only show published courses to non-admins
      const authResult = await AuthMiddleware.verifyAuth(req)
      const isAdmin = authResult.user && 
        [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authResult.user.role)

      if (!course.isPublished && !isAdmin) {
        return ApiResponse.error('Course not found', 404)
      }

      return ApiResponse.success(course, 'Course retrieved successfully')
    } catch (error) {
      console.error('Get course error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateCourse(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      const course = await CourseModel.updateCourse(params.id, data)

      return ApiResponse.success(course, 'Course updated successfully')
    } catch (error) {
      console.error('Update course error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteCourse(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      await CourseModel.deleteCourse(params.id)

      return ApiResponse.success(null, 'Course deleted successfully')
    } catch (error) {
      console.error('Delete course error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getPublishedCourses(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const categorySlug = searchParams.get('category')
      const level = searchParams.get('level') as CourseLevel | null
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const result = await CourseModel.getPublishedCourses({
        categorySlug,
        level,
        page,
        limit
      })

      return ApiResponse.success(result, 'Courses retrieved successfully')
    } catch (error) {
      console.error('Get published courses error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async enrollInCourse(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const course = await CourseModel.findById(params.id)
      if (!course) {
        return ApiResponse.error('Course not found', 404)
      }

      if (!course.isPublished) {
        return ApiResponse.error('Course is not available for enrollment', 400)
      }

      // Check if already enrolled
      const existingEnrollment = await CourseModel.getUserEnrollment(params.id, authResult.user!.id)
      if (existingEnrollment) {
        return ApiResponse.error('Already enrolled in this course', 400)
      }

      const enrollment = await CourseModel.enrollUser(params.id, authResult.user!.id)

      return ApiResponse.success(
        enrollment,
        'Enrolled in course successfully',
        201
      )
    } catch (error) {
      console.error('Enroll in course error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateLessonProgress(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { lessonId, isCompleted, watchedDuration, lastPosition } = await req.json()

      if (!lessonId) {
        return ApiResponse.error('Lesson ID is required', 400)
      }

      const progress = await CourseModel.updateLessonProgress({
        userId: authResult.user!.id,
        lessonId,
        isCompleted,
        watchedDuration,
        lastPosition
      })

      return ApiResponse.success(progress, 'Progress updated successfully')
    } catch (error) {
      console.error('Update lesson progress error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getUserEnrollments(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      // This would require adding a method to CourseModel to get user enrollments
      // For now, returning success with empty data
      return ApiResponse.success([], 'Enrollments retrieved successfully')
    } catch (error) {
      console.error('Get user enrollments error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  // Module and Lesson management
  static async createModule(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { courseId, title, description, order } = await req.json()

      if (!courseId || !title || order === undefined) {
        return ApiResponse.error('Course ID, title, and order are required', 400)
      }

      const module = await CourseModel.createModule({
        courseId,
        title,
        description,
        order
      })

      return ApiResponse.success(module, 'Module created successfully', 201)
    } catch (error) {
      console.error('Create module error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async createLesson(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { moduleId, title, description, type, content, videoUrl, duration, order, isFree } = await req.json()

      if (!moduleId || !title || order === undefined) {
        return ApiResponse.error('Module ID, title, and order are required', 400)
      }

      const lesson = await CourseModel.createLesson({
        moduleId,
        title,
        description,
        type,
        content,
        videoUrl,
        duration,
        order,
        isFree
      })

      return ApiResponse.success(lesson, 'Lesson created successfully', 201)
    } catch (error) {
      console.error('Create lesson error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}