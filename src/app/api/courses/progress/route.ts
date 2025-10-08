// src/app/api/courses/progress/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAuth } from '@/middleware/auth'

export const PUT = requireAuth(async (req: NextRequest) => {
  return await CourseController.updateLessonProgress(req)
})