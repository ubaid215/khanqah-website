// src/app/api/answers/[id]/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/QusetionController'
import { requireAuth } from '@/middleware/auth'

export const DELETE = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await QuestionController.deleteAnswer(req, { params })
})