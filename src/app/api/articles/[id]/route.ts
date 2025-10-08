// src/app/api/articles/[id]/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
import { requireAdmin } from '@/middleware/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return await ArticleController.getArticle(req, { params })
}

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await ArticleController.updateArticle(req, { params })
})

export const DELETE = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await ArticleController.deleteArticle(req, { params })
})