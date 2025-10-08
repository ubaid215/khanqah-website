// src/app/api/courses/[id]/enroll/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAuth } from '@/middleware/auth'

export const POST = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await CourseController.enrollInCourse(req, { params })
})