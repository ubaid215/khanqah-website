// src/app/api/questions/[id]/answers/route.ts
import { NextRequest } from 'next/server'
import { QuestionController } from '@/controllers/QusetionController'
import { requireAuth } from '@/middleware/auth'

export const POST = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await QuestionController.createAnswer(req, { params: { questionId: params.id } })
})