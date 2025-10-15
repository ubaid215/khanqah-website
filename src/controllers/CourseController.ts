import { NextRequest, NextResponse } from 'next/server'
import { CourseModel } from '@/models/Course'
import { AuthMiddleware, ApiResponse } from '@/controllers/AuthController'
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

      console.log('📝 [CourseController] Creating course with data:', {
        title,
        slug,
        categoryIds,
        categoryIdsType: typeof categoryIds,
        categoryIdsLength: categoryIds?.length
      })

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

      // Ensure categoryIds is always an array
      const sanitizedCategoryIds = Array.isArray(categoryIds) ? categoryIds : []

      const course = await CourseModel.create({
        title,
        slug,
        description,
        shortDesc,
        thumbnail,
        level,
        price,
        isFree,
        categoryIds: sanitizedCategoryIds
      })

      console.log('✅ [CourseController] Course created successfully:', {
        id: course.id,
        title: course.title,
        categories: course.categories
      })

      return ApiResponse.success(
        course,
        'Course created successfully',
        201
      )
    } catch (error: any) {
      console.error('❌ [CourseController] Create course error:', error)
      
      if (error.message.includes('Unique constraint')) {
        return ApiResponse.error('Course with this slug already exists', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async getCourse(req: NextRequest, { params }: { params: { id?: string; slug?: string } }) {
    console.log("📘 [CourseController] getCourse() called with params:", params);

    try {
      let course;

      // 🔹 Check what identifier is provided
      if (params.id) {
        console.log("🔍 Fetching course by ID:", params.id);
        course = await CourseModel.findById(params.id);
      } else if (params.slug) {
        console.log("🔍 Fetching course by Slug:", params.slug);
        course = await CourseModel.findBySlug(params.slug);
      } else {
        console.warn("⚠️ No course ID or slug provided in params");
        return ApiResponse.error("Course ID or slug is required", 400);
      }

      // 🔹 Check if course was found
      if (!course) {
        console.warn("❌ Course not found for given params:", params);
        return ApiResponse.error("Course not found", 404);
      }

      // 🔹 Verify authentication
      console.log("🔑 Verifying authentication...");
      const authResult = await AuthMiddleware.verifyAuth(req);
      console.log("👤 Auth result:", authResult?.user ? `User: ${authResult.user.email}` : "No user");

      // 🔹 Check admin privileges
      const isAdmin =
        authResult.user &&
        [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authResult.user.role);
      console.log("🛡️ Is Admin:", isAdmin);

      // 🔹 Restrict unpublished courses for non-admin users
      if (!course.isPublished && !isAdmin) {
        console.warn("🚫 Unpublished course accessed by non-admin user");
        return ApiResponse.error("Course not found", 404);
      }

      console.log("✅ Course retrieved successfully:", {
        id: course.id,
        title: course.title,
        slug: course.slug,
        isPublished: course.isPublished,
        categories: course.categories
      });

      return ApiResponse.success(course, "Course retrieved successfully");
    } catch (error: any) {
      console.error("🔥 [getCourse] Internal server error:", error.message || error);
      return ApiResponse.error("Internal server error");
    }
  }

  static async updateCourse(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      
      console.log('📝 [CourseController] Updating course with data:', {
        id: params.id,
        data,
        categoryIds: data.categoryIds,
        categoryIdsType: typeof data.categoryIds,
        categoryIdsLength: data.categoryIds?.length
      })

      // Ensure categoryIds is always an array
      if (data.categoryIds !== undefined) {
        data.categoryIds = Array.isArray(data.categoryIds) ? data.categoryIds : []
      }

      const course = await CourseModel.updateCourse(params.id, data)

      console.log('✅ [CourseController] Course updated successfully:', {
        id: course.id,
        title: course.title,
        categories: course.categories
      })

      return ApiResponse.success(course, 'Course updated successfully')
    } catch (error: any) {
      console.error('❌ [CourseController] Update course error:', error)
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
      const categorySlug = searchParams.get('category') || undefined
      const level = (searchParams.get('level') as CourseLevel) || undefined
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

  static async getAllCourses(req: NextRequest) {
    try {
      // Verify admin authentication
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { searchParams } = new URL(req.url)
      const status = (searchParams.get('status') as CourseStatus) || undefined
      const level = (searchParams.get('level') as CourseLevel) || undefined
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '100')

      // Get all courses with filters (including drafts and archived)
      const result = await CourseModel.getAllCourses({
        status,
        level,
        page,
        limit
      })

      return ApiResponse.success(result, 'Courses retrieved successfully')
    } catch (error) {
      console.error('Get all courses error:', error)
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

  static async getLessonProgress(req: NextRequest, { params }: { params: { lessonId: string } }) {
    console.log("📘 [LessonController] getLessonProgress() called with params:", params);

    try {
      // Step 1: Verify authentication
      const authResult = await AuthMiddleware.verifyAuth(req);
      console.log("👤 Auth verification result:", {
        isAuthenticated: !authResult.error,
        userId: authResult.user?.id,
        userRole: authResult.user?.role,
      });

      if (authResult.error) {
        console.warn("⚠️ Unauthorized access attempt for lesson progress:", {
          lessonId: params.lessonId,
        });
        return ApiResponse.error(authResult.error, 401);
      }

      // Step 2: Fetch lesson progress
      console.log("🔍 Fetching progress for:", {
        lessonId: params.lessonId,
        userId: authResult.user!.id,
      });

      const progress = await CourseModel.getLessonProgress(params.lessonId, authResult.user!.id);

      // Step 3: Check if progress exists
      if (!progress) {
        console.warn("❌ Lesson progress not found for:", {
          lessonId: params.lessonId,
          userId: authResult.user!.id,
        });
        return ApiResponse.error("Progress not found", 404);
      }

      console.log("✅ Lesson progress retrieved successfully:", progress);

      return ApiResponse.success(progress, "Lesson progress retrieved successfully");
    } catch (error) {
      console.error("💥 [LessonController] Get lesson progress error:", error);
      return ApiResponse.error("Internal server error");
    }
  }

  static async getUserEnrollments(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      // Use the CourseModel method to get actual enrollments
      const enrollments = await CourseModel.getUserEnrollments(authResult.user!.id)

      return ApiResponse.success(enrollments, 'Enrollments retrieved successfully')
    } catch (error) {
      console.error('Get user enrollments error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getUserEnrollment(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const enrollment = await CourseModel.getUserEnrollment(params.id, authResult.user!.id)
      
      if (!enrollment) {
        return ApiResponse.error('Enrollment not found', 404)
      }

      return ApiResponse.success(enrollment, 'Enrollment retrieved successfully')
    } catch (error) {
      console.error('Get user enrollment error:', error)
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

  // Module methods
  static async updateModule(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      const module = await CourseModel.updateModule(params.id, data)

      return ApiResponse.success(module, 'Module updated successfully')
    } catch (error) {
      console.error('Update module error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteModule(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      await CourseModel.deleteModule(params.id)
      return ApiResponse.success(null, 'Module deleted successfully')
    } catch (error) {
      console.error('Delete module error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  // Lesson methods
  static async updateLesson(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      const lesson = await CourseModel.updateLesson(params.id, data)

      return ApiResponse.success(lesson, 'Lesson updated successfully')
    } catch (error) {
      console.error('Update lesson error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteLesson(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      await CourseModel.deleteLesson(params.id)
      return ApiResponse.success(null, 'Lesson deleted successfully')
    } catch (error) {
      console.error('Delete lesson error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}