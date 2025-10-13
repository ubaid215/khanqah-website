import { NextRequest, NextResponse } from 'next/server'
import { ArticleModel } from '@/models/Article'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    if (!slug || slug.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Slug must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Check if article with this slug exists
    const existingArticle = await ArticleModel.findBySlug(slug)
    
    return NextResponse.json({
      success: true,
      data: {
        available: !existingArticle,
        slug: slug
      }
    })
  } catch (error) {
    console.error('Check slug availability error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}