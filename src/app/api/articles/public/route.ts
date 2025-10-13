// src/app/api/articles/public/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ArticleController } from '@/controllers/ArticleController'

// GET /api/articles/public - Get published articles (public)
export async function GET(req: NextRequest) {
  try {
    return await ArticleController.getPublishedArticles(req)
  } catch (error) {
    console.error('Get public articles error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}