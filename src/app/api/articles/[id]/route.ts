// src/app/api/articles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'
import { requireAuth, requireAdmin } from '@/middleware/auth'

// GET /api/articles/[id] - Get specific article
export const GET = requireAuth(requireAdmin(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      return await ArticleController.getArticles(req, { params })
    } catch (error) {
      console.error('Get article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
))

// PUT /api/articles/[id] - Update article
export const PUT = requireAuth(requireAdmin(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      return await ArticleController.updateArticle(req, { params })
    } catch (error) {
      console.error('Update article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
))

// DELETE /api/articles/[id] - Delete article
export const DELETE = requireAuth(requireAdmin(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      return await ArticleController.deleteArticle(req, { params })
    } catch (error) {
      console.error('Delete article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
))