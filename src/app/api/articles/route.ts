// src/app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
import { requireAuth, requireAdmin } from '@/middleware/auth'

// GET /api/articles - Get all articles (admin only)
export const GET = requireAuth(requireAdmin(
  async (req: NextRequest) => {
    try {
      return await ArticleController.getPublishedArticles(req)
    } catch (error) {
      console.error('Get articles error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
))

// POST /api/articles - Create new article (admin only)
export const POST = requireAuth(requireAdmin(
  async (req: NextRequest) => {
    try {
      return await ArticleController.createArticle(req)
    } catch (error) {
      console.error('Create article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
))