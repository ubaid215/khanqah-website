// src/controllers/BookController.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookModel } from '@/models/Book'
import { AuthMiddleware } from './AuthController'
import { BookStatus, UserRole } from '@prisma/client'

export class BookController {
  static async createBook(req: NextRequest) {
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
        return NextResponse.json(
          { success: false, error: 'Validation failed', details: validationErrors },
          { status: 400 }
        )
      }

      // Check if slug already exists
      const existingBook = await BookModel.findBySlug(slug)
      if (existingBook) {
        return NextResponse.json(
          { success: false, error: 'Book with this slug already exists' },
          { status: 400 }
        )
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

      return NextResponse.json({
        success: true,
        data: book,
        message: 'Book created successfully'
      }, { status: 201 })
    } catch (error: any) {
      console.error('Create book error:', error)
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, error: 'Book with this slug already exists' },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getBook(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
      const book = await BookModel.findBySlug(params.slug)
      if (!book) {
        return NextResponse.json(
          { success: false, error: 'Book not found' },
          { status: 404 }
        )
      }

      // Only show published books to non-admins
      const authResult = await AuthMiddleware.verifyAuth(req)
      const isAdmin = authResult.user && 
        [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authResult.user.role)

      if (book.status !== BookStatus.PUBLISHED && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'Book not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: book,
        message: 'Book retrieved successfully'
      })
    } catch (error) {
      console.error('Get book error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async updateBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      const data = await req.json()
      const book = await BookModel.updateBook(params.id, data)

      return NextResponse.json({
        success: true,
        data: book,
        message: 'Book updated successfully'
      })
    } catch (error) {
      console.error('Update book error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async deleteBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      await BookModel.deleteBook(params.id)

      return NextResponse.json({
        success: true,
        data: null,
        message: 'Book deleted successfully'
      })
    } catch (error) {
      console.error('Delete book error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async publishBook(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }

      const book = await BookModel.publishBook(params.id)

      return NextResponse.json({
        success: true,
        data: book,
        message: 'Book published successfully'
      })
    } catch (error) {
      console.error('Publish book error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getPublishedBooks(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const search = searchParams.get('search') || undefined

      const result = await BookModel.getPublishedBooks({
        page,
        limit,
        search
      })

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Books retrieved successfully'
      })
    } catch (error) {
      console.error('Get published books error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async getPopularBooks(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const limit = parseInt(searchParams.get('limit') || '10')

      const books = await BookModel.getPopularBooks(limit)

      return NextResponse.json({
        success: true,
        data: books,
        message: 'Popular books retrieved successfully'
      })
    } catch (error) {
      console.error('Get popular books error:', error)
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  static async downloadBook(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await BookModel.findById(params.id)
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.status !== BookStatus.PUBLISHED) {
      return NextResponse.json(
        { success: false, error: 'Book not available for download' },
        { status: 400 }
      )
    }

    if (!book.fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Book file not available' },
        { status: 400 }
      )
    }

    // Get the file from your storage (adjust based on your storage solution)
    const response = await fetch(book.fileUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch file')
    }

    // Get the file as blob
    const fileBlob = await response.blob()
    
    // Get filename from URL or use book title
    const filename = book.fileUrl.split('/').pop() || `${book.slug}.pdf`
    const safeFilename = encodeURIComponent(filename)

    // Increment download count for analytics
    await BookModel.incrementDownloads(params.id)

    // Return the file as a download
    return new NextResponse(fileBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Content-Length': fileBlob.size.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Download book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
}