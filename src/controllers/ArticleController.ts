// src/controllers/ArticleController.ts
import { NextRequest, NextResponse } from 'next/server'
import { ArticleModel } from '@/models/Article'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { ArticleStatus, UserRole } from '@prisma/client'

export class ArticleController {
  static async createArticle(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
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
        return ApiResponse.validationError(validationErrors)
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

      return ApiResponse.success(
        article,
        'Article created successfully',
        201
      )
    } catch (error: any) {
      console.error('Create article error:', error)
      
      if (error.message.includes('Unique constraint')) {
        return ApiResponse.error('Article with this slug already exists', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async getArticle(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
      const article = await ArticleModel.findBySlug(params.slug)
      if (!article) {
        return ApiResponse.error('Article not found', 404)
      }

      // Only show published articles to non-admins
      const authResult = await AuthMiddleware.verifyAuth(req)
      const isAdmin = authResult.user && 
        [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authResult.user.role)

      if (article.status !== ArticleStatus.PUBLISHED && !isAdmin) {
        return ApiResponse.error('Article not found', 404)
      }

      // Increment views for published articles
      if (article.status === ArticleStatus.PUBLISHED) {
        await ArticleModel.incrementViews(article.id)
      }

      return ApiResponse.success(article, 'Article retrieved successfully')
    } catch (error) {
      console.error('Get article error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      const article = await ArticleModel.updateArticle(params.id, data)

      return ApiResponse.success(article, 'Article updated successfully')
    } catch (error) {
      console.error('Update article error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      await ArticleModel.deleteArticle(params.id)

      return ApiResponse.success(null, 'Article deleted successfully')
    } catch (error) {
      console.error('Delete article error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async publishArticle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const article = await ArticleModel.publishArticle(params.id)

      return ApiResponse.success(article, 'Article published successfully')
    } catch (error) {
      console.error('Publish article error:', error)
      return ApiResponse.error('Internal server error')
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

      return ApiResponse.success(result, 'Articles retrieved successfully')
    } catch (error) {
      console.error('Get published articles error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getAllTags(req: NextRequest) {
    try {
      const tags = await ArticleModel.getAllTags()

      return ApiResponse.success(tags, 'Tags retrieved successfully')
    } catch (error) {
      console.error('Get tags error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getPopularTags(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get('limit') || '10')

      const tags = await ArticleModel.getPopularTags(limit)

      return ApiResponse.success(tags, 'Popular tags retrieved successfully')
    } catch (error) {
      console.error('Get popular tags error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}