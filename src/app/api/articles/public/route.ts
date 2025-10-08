// src/app/api/articles/public/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'

export async function GET(req: NextRequest) {
  return await ArticleController.getPublishedArticles(req)
}