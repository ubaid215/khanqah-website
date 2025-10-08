// src/app/api/articles/route.ts
import { NextRequest } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
import { requireAdmin } from '@/middleware/auth'

export const GET = async (req: NextRequest) => {
  // Public access to published articles
  const { searchParams } = new URL(req.url)
  if (searchParams.get('published') === 'true') {
    return await ArticleController.getPublishedArticles(req)
  }
  
  // Admin access to all articles
  return requireAdmin(ArticleController.getAllArticles)(req)
}

export const POST = requireAdmin(async (req: NextRequest) => {
  return await ArticleController.createArticle(req)
})

// Helper function for admin-only article listing
async function getAllArticles(req: NextRequest) {
  // This would call a method to get all articles (including drafts)
  // For now, redirecting to published articles
  return await ArticleController.getPublishedArticles(req)
}