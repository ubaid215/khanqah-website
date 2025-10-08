// src/app/api/questions/public/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/QusetionController'

export async function GET(req: NextRequest) {
  return await QuestionController.getQuestions(req)
}