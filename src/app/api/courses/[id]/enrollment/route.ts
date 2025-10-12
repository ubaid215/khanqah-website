// src/app/api/courses/[id]/enrollment/route.ts
import { NextRequest } from 'next/server'
import { CourseController } from '@/controllers/CourseController'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  console.log("📘 [Route] /api/courses/[id]/enrollment called with:", params);
  return await CourseController.getUserEnrollment(req, { params });
});
