// src/app/api/articles/slug/[slug]/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  return await ArticleController.getArticle(req, { params: { slug: params.slug } })
}