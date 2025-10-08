// src/app/api/courses/slug/[slug]/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  return await CourseController.getCourse(req, { params: { slug: params.slug } })
}