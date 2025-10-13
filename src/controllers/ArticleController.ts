// src/controllers/ArticleController.ts
import { NextRequest, NextResponse } from 'next/server'
import { ArticleModel } from '@/models/Article'
import { AuthMiddleware } from './AuthController'
import { ArticleStatus, UserRole } from '@prisma/client'

export class ArticleController {
  static async createArticle(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      const { 
        title, 
        slug, 
        content, 
        excerpt, 
        thumbnail, 
        tagNames, 
        readTime 
      } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!title) validationErrors.title = 'Title is required'
      if (!slug) validationErrors.slug = 'Slug is required'
      if (!content) validationErrors.content = 'Content is required'
      
      if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        validationErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
      }

      if (Object.keys(validationErrors).length > 0) {
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: validationErrors },
          { status: 400 }
        )
      }

      // Check if slug already exists
      const existingArticle = await ArticleModel.findBySlug(slug)
      if (existingArticle) {
        return NextResponse.json(
          { success: false, error: 'Article with this slug already exists' },
          { status: 400 }
        )
      }

      const article = await ArticleModel.create({
        title,
        slug,
        content,
        excerpt,
        thumbnail,
        tagNames,
        readTime
      })

      return NextResponse.json({
        success: true,
        data: article,
        message: 'Article created successfully'
      }, { status: 201 })
    } catch (error: any) {
      console.error('Create article error:', error)
      
      // Handle Prisma unique constraint error
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Article with this slug already exists' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // Add this method to handle slug checking
static async checkSlugAvailability(req: NextRequest, { params }: { params: { slug: string } }) {
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

// Update the getArticles method to ensure consistent response structure
static async getArticles(req: NextRequest) {
  try {
    console.log('🔍 [ArticleController] getArticles called');
    
    const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
    if (authResult.error) {
      console.log('❌ [ArticleController] Auth failed:', authResult.error);
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') as ArticleStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50') // Increased limit for testing

    console.log('📋 [ArticleController] Query params:', {
      status,
      page,
      limit,
      url: req.url
    });

    // Build where clause - include ALL articles for admin
    const where: any = {}
    if (status && status !== 'all') {
      where.status = status
    }
    // If no status filter or status is 'all', don't filter by status

    console.log('🔍 [ArticleController] Prisma where clause:', where);

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          tags: {
            include: { tag: true }
          },
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              bookmarks: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.article.count({ where })
    ])

    console.log('📊 [ArticleController] Query results:', {
      articlesFound: articles.length,
      totalArticles: total,
      articleIds: articles.map(a => a.id),
      articleTitles: articles.map(a => a.title)
    });

    return NextResponse.json({
      success: true,
      data: {
        articles,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      message: 'Articles retrieved successfully'
    })
  } catch (error) {
    console.error('❌ [ArticleController] Get articles error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

  static async updateArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      const data = await req.json()
      const article = await ArticleModel.updateArticle(params.id, data)

      return NextResponse.json({
        success: true,
        data: article,
        message: 'Article updated successfully'
      })
    } catch (error) {
      console.error('Update article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async deleteArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      await ArticleModel.deleteArticle(params.id)

      return NextResponse.json({
        success: true,
        data: null,
        message: 'Article deleted successfully'
      })
    } catch (error) {
      console.error('Delete article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async publishArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      const article = await ArticleModel.publishArticle(params.id)

      return NextResponse.json({
        success: true,
        data: article,
        message: 'Article published successfully'
      })
    } catch (error) {
      console.error('Publish article error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getPublishedArticles(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const tagSlug = searchParams.get('tag')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const result = await ArticleModel.getPublishedArticles({
        tagSlug,
        page,
        limit
      })

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Articles retrieved successfully'
      })
    } catch (error) {
      console.error('Get published articles error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getAllTags(req: NextRequest) {
    try {
      const tags = await ArticleModel.getAllTags()

      return NextResponse.json({
        success: true,
        data: tags,
        message: 'Tags retrieved successfully'
      })
    } catch (error) {
      console.error('Get tags error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getPopularTags(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get('limit') || '10')

      const tags = await ArticleModel.getPopularTags(limit)

      return NextResponse.json({
        success: true,
        data: tags,
        message: 'Popular tags retrieved successfully'
      })
    } catch (error) {
      console.error('Get popular tags error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}