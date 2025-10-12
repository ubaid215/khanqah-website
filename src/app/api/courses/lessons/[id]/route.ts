// src/app/api/courses/lessons/[id]/route.ts

import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'

type RouteContext = {
  params: {
    id: string
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return CourseController.updateLesson(req, context)
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return CourseController.deleteLesson(req, context)
}