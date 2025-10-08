// src/app/api/courses/[id]/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAdmin } from '@/middleware/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return await CourseController.getCourse(req, { params })
}

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await CourseController.updateCourse(req, { params })
})

export const DELETE = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await CourseController.deleteCourse(req, { params })
})