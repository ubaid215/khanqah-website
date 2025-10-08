// src/app/api/questions/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/CourseController'
import { requireAuth } from '@/middleware/auth'

export const GET = async (req: NextRequest) => {
  return await QuestionController.getQuestions(req)
}

export const POST = requireAuth(async (req: NextRequest) => {
  return await QuestionController.createQuestion(req)
})