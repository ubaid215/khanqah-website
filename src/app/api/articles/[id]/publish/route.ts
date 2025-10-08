// src/app/api/articles/[id]/publish/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
import { requireAdmin } from '@/middleware/auth'

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await ArticleController.publishArticle(req, { params })
})