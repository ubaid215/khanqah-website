// src/app/api/courses/progress/[lessonId]/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'

type RouteContext = {
  params: {
    lessonId: string
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  return CourseController.getLessonProgress(req, context)
}