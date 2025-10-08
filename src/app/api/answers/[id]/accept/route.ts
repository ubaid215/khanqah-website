// src/app/api/answers/[id]/accept/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/QusetionController'
import { requireAuth } from '@/middlewares/auth'

export const PUT = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await QuestionController.acceptAnswer(req, { params })
})