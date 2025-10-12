import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  console.log('API Route - Received params:', params)
  console.log('API Route - Slug:', params.slug)
  
  return CourseController.getCourse(req, { params: { slug: params.slug } })
}