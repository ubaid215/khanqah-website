// src/controllers/BookController.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookModel } from '@/models/Book'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { BookStatus, UserRole } from '@prisma/client'

export class BookController {
  static async createBook(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { 
        title, 
        slug, 
        description, 
        author, 
        coverImage, 
        fileUrl, 
        pages 
      } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!title) validationErrors.title = 'Title is required'
      if (!slug) validationErrors.slug = 'Slug is required'
      if (!description) validationErrors.description = 'Description is required'
      if (!author) validationErrors.author = 'Author is required'
      
      if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        validationErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const book = await BookModel.create({
        title,
        slug,
        description,
        author,
        coverImage,
        fileUrl,
        pages
      })

      return ApiResponse.success(
        book,
        'Book created successfully',
        201
      )
    } catch (error: any) {
      console.error('Create book error:', error)
      
      if (error.message.includes('Unique constraint')) {
        return ApiResponse.error('Book with this slug already exists', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async getBook(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
      const book = await BookModel.findBySlug(params.slug)
      if (!book) {
        return ApiResponse.error('Book not found', 404)
      }

      // Only show published books to non-admins
      const authResult = await AuthMiddleware.verifyAuth(req)
      const isAdmin = authResult.user && 
        [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authResult.user.role)

      if (book.status !== BookStatus.PUBLISHED && !isAdmin) {
        return ApiResponse.error('Book not found', 404)
      }

      return ApiResponse.success(book, 'Book retrieved successfully')
    } catch (error) {
      console.error('Get book error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const data = await req.json()
      const book = await BookModel.updateBook(params.id, data)

      return ApiResponse.success(book, 'Book updated successfully')
    } catch (error) {
      console.error('Update book error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      await BookModel.deleteBook(params.id)

      return ApiResponse.success(null, 'Book deleted successfully')
    } catch (error) {
      console.error('Delete book error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async publishBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const book = await BookModel.publishBook(params.id)

      return ApiResponse.success(book, 'Book published successfully')
    } catch (error) {
      console.error('Publish book error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getPublishedBooks(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      const result = await BookModel.getPublishedBooks({
        page,
        limit
      })

      return ApiResponse.success(result, 'Books retrieved successfully')
    } catch (error) {
      console.error('Get published books error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getPopularBooks(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get('limit') || '10')

      const books = await BookModel.getPopularBooks(limit)

      return ApiResponse.success(books, 'Popular books retrieved successfully')
    } catch (error) {
      console.error('Get popular books error:', error)
      return ApiResponse.error('Internal server error')
    }
  }


static async downloadBook(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await BookModel.findById(params.id)
    if (!book) {
      return ApiResponse.error('Book not found', 404)
    }

    if (book.status !== BookStatus.PUBLISHED) {
      return ApiResponse.error('Book not available for download', 400)
    }

    if (!book.fileUrl) {
      return ApiResponse.error('Book file not available', 400)
    }

    // Increment download count for analytics
    await BookModel.incrementDownloads(params.id)

    // Return download URL (no authentication required)
    return ApiResponse.success(
      { 
        downloadUrl: book.fileUrl,
        book: {
          title: book.title,
          author: book.author,
          description: book.description
        }
      },
      'Download ready'
    )
  } catch (error) {
    console.error('Download book error:', error)
    return ApiResponse.error('Internal server error')
  }
}
}