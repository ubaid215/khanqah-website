// src/controllers/BookmarkController.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookmarkModel } from '@/models/Bookmark'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { BookmarkType } from '@prisma/client'

export class BookmarkController {
  static async createBookmark(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { type, articleId, bookId, courseId } = await req.json()

      // Validation
      if (!type || !Object.values(BookmarkType).includes(type)) {
        return ApiResponse.error('Valid bookmark type is required', 400)
      }

      const bookmark = await BookmarkModel.create({
        userId: authResult.user!.id,
        type,
        articleId,
        bookId,
        courseId
      })

      return ApiResponse.success(
        bookmark,
        'Bookmark created successfully',
        201
      )
    } catch (error: any) {
      console.error('Create bookmark error:', error)
      
      if (error.message.includes('Exactly one resource ID')) {
        return ApiResponse.error('Exactly one resource ID must be provided', 400)
      }
      
      if (error.message.includes('Unique constraint')) {
        return ApiResponse.error('Already bookmarked', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteBookmark(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      await BookmarkModel.delete(params.id)

      return ApiResponse.success(null, 'Bookmark removed successfully')
    } catch (error) {
      console.error('Delete bookmark error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteBookmarkByResource(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { type, articleId, bookId, courseId } = await req.json()

      if (!type || !Object.values(BookmarkType).includes(type)) {
        return ApiResponse.error('Valid bookmark type is required', 400)
      }

      await BookmarkModel.deleteByResource({
        userId: authResult.user!.id,
        type,
        articleId,
        bookId,
        courseId
      })

      return ApiResponse.success(null, 'Bookmark removed successfully')
    } catch (error) {
      console.error('Delete bookmark by resource error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getUserBookmarks(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { searchParams } = new URL(req.url)
      const typeParam = searchParams.get('type')
      
      // Convert null to undefined to match the expected type
      const type = typeParam as BookmarkType | undefined

      const bookmarks = await BookmarkModel.getUserBookmarks(authResult.user!.id, type)

      return ApiResponse.success(bookmarks, 'Bookmarks retrieved successfully')
    } catch (error) {
      console.error('Get user bookmarks error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async checkBookmark(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { searchParams } = new URL(req.url)
      const type = searchParams.get('type') as BookmarkType
      const articleId = searchParams.get('articleId')
      const bookId = searchParams.get('bookId')
      const courseId = searchParams.get('courseId')

      if (!type || !Object.values(BookmarkType).includes(type)) {
        return ApiResponse.error('Valid bookmark type is required', 400)
      }

      const isBookmarked = await BookmarkModel.isBookmarked({
        userId: authResult.user!.id,
        type,
        articleId: articleId || undefined,
        bookId: bookId || undefined,
        courseId: courseId || undefined
      })

      return ApiResponse.success(
        { isBookmarked },
        'Bookmark status retrieved successfully'
      )
    } catch (error) {
      console.error('Check bookmark error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getBookmarkCount(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const articleId = searchParams.get('articleId')
      const bookId = searchParams.get('bookId')
      const courseId = searchParams.get('courseId')

      const count = await BookmarkModel.getBookmarkCount({
        articleId: articleId || undefined,
        bookId: bookId || undefined,
        courseId: courseId || undefined
      })

      return ApiResponse.success(
        { count },
        'Bookmark count retrieved successfully'
      )
    } catch (error) {
      console.error('Get bookmark count error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}