// src/app/api/courses/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAdmin } from '@/middleware/auth'

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  
  // Public access to published courses only
  if (searchParams.get('published') === 'true') {
    return await CourseController.getPublishedCourses(req)
  }
  
  // Admin access to all courses (including drafts and archived)
  return requireAdmin(CourseController.getAllCourses)(req)
}

export const POST = requireAdmin(async (req: NextRequest) => {
  return await CourseController.createCourse(req)
})