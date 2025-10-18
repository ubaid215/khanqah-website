// src/app/api/courses/enrollments/my/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAuth } from '@/middleware/auth'
export const dynamic = 'force-dynamic'

export const GET = requireAuth(async (req: NextRequest) => {
  return await CourseController.getUserEnrollments(req)
})