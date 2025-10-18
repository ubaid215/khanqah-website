// src/app/api/articles/tags/popular/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return await ArticleController.getPopularTags(req)
}