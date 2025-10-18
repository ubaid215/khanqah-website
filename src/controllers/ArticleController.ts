import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Import prisma properly
import { AuthMiddleware } from './AuthController'
import { ArticleStatus, UserRole } from '@prisma/client'

export class ArticleController {
  static getArticle: any
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

      // FIXED: Use imported prisma instance
      const existingArticle = await prisma.article.findUnique({
        where: { slug }
      })

      if (existingArticle) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Article with this slug already exists',
            code: 'SLUG_EXISTS'
          },
          { status: 400 }
        )
      }

      // Generate a unique slug if needed
      let finalSlug = slug
      let slugCounter = 1
      
      while (await prisma.article.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${slug}-${slugCounter}`
        slugCounter++
      }

      const article = await prisma.article.create({
        data: {
          title,
          slug: finalSlug,
          content,
          excerpt: excerpt || null, // FIXED: Handle null properly
          thumbnail: thumbnail || null,
          readTime: readTime || null,
          tags: tagNames && tagNames.length > 0 ? {
            create: tagNames.map((tagName: string) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName.toLowerCase() },
                  create: { 
                    name: tagName.toLowerCase(),
                    slug: tagName.toLowerCase().replace(/\s+/g, '-')
                  }
                }
              }
            }))
          } : undefined
        },
        include: {
          tags: {
            include: { tag: true }
          }
        }
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
          { 
            success: false, 
            error: 'Article with this slug already exists',
            code: 'SLUG_EXISTS'
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

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
      const existingArticle = await prisma.article.findUnique({
        where: { slug }
      })
      
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

  
static async getArticles(req: NextRequest, p0?: { params: { id: string } }) {
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
    const statusParam = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    console.log('📋 [ArticleController] Query params:', {
      statusParam,
      page,
      limit,
      url: req.url
    });

    // Build where clause
    const where: any = {}
    if (statusParam && statusParam !== 'all') {
      where.status = statusParam as ArticleStatus
    } else {
      console.log('🔍 [ArticleController] No status filter applied - getting ALL articles');
    }

    console.log('🔍 [ArticleController] Final Prisma where clause:', JSON.stringify(where));

    // FIXED: Add more detailed debugging
    console.log('🔍 [ArticleController] About to query database...');
    
    const articles = await prisma.article.findMany({
      where,
      include: {
        tags: {
          include: { tag: true }
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
    })

    const total = await prisma.article.count({ where })

    console.log('📊 [ArticleController] Database query results:', {
      articlesFound: articles.length,
      totalArticlesInDB: total,
      articleIds: articles.map(a => a.id),
      articleTitles: articles.map(a => a.title),
      sampleArticle: articles.length > 0 ? articles[0] : 'NO ARTICLES FOUND'
    });

    // FIXED: Check if we have any articles in the database at all
    const totalAllArticles = await prisma.article.count({})
    console.log('📊 [ArticleController] Total articles in database (no filters):', totalAllArticles);

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
      
      // FIXED: Use prisma directly for update
      const article = await prisma.article.update({
        where: { id: params.id },
        data: {
          ...data,
          excerpt: data.excerpt || null,
          thumbnail: data.thumbnail || null,
          readTime: data.readTime || null
        },
        include: {
          tags: {
            include: { tag: true }
          }
        }
      })

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

      await prisma.article.delete({
        where: { id: params.id }
      })

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

      const article = await prisma.article.update({
        where: { id: params.id },
        data: {
          status: ArticleStatus.PUBLISHED,
          publishedAt: new Date()
        },
        include: {
          tags: {
            include: { tag: true }
          }
        }
      })

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

      const where: any = {
        status: ArticleStatus.PUBLISHED
      }

      if (tagSlug) {
        where.tags = {
          some: {
            tag: {
              slug: tagSlug
            }
          }
        }
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: {
            tags: {
              include: { tag: true }
            }
          },
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.article.count({ where })
      ])

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
      console.error('Get published articles error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getAllTags(req: NextRequest) {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: { name: 'asc' }
      })

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

      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              articles: true
            }
          }
        },
        orderBy: {
          articles: {
            _count: 'desc'
          }
        },
        take: limit
      })

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