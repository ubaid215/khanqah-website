// src/app/api/questions/[id]/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/QusetionController'
import { requireAuth } from '@/middleware/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return await QuestionController.getQuestion(req, { params })
}

export const PUT = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await QuestionController.updateQuestion(req, { params })
})

export const DELETE = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await QuestionController.deleteQuestion(req, { params })
})