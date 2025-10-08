// src/app/api/courses/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAdmin } from '@/middleware/auth'

export const GET = async (req: NextRequest) => {
  // Public access to published courses
  const { searchParams } = new URL(req.url)
  if (searchParams.get('published') === 'true') {
    return await CourseController.getPublishedCourses(req)
  }
  
  // Admin access to all courses
  return requireAdmin(CourseController.getAllCourses)(req)
}

export const POST = requireAdmin(async (req: NextRequest) => {
  return await CourseController.createCourse(req)
})

// Helper function for admin-only course listing
async function getAllCourses(req: NextRequest) {
  // This would call a method to get all courses (including unpublished)
  // For now, redirecting to published courses
  return await CourseController.getPublishedCourses(req)
}