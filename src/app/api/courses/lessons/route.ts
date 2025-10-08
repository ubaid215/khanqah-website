// src/app/api/courses/lessons/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAdmin } from '@/middleware/auth'

export const POST = requireAdmin(async (req: NextRequest) => {
  return await CourseController.createLesson(req)
})