// src/app/api/courses/public/route.ts
import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { CourseController } from '@/controllers/CourseController'

export async function GET(req: NextRequest) {
  return await CourseController.getPublishedCourses(req)
}