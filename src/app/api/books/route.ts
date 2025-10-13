// src/app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { requireAuth, requireAdmin } from '@/middleware/auth'

// GET /api/books - Get all books (admin only)
async function getBooksHandler(req: NextRequest) {
  try {
    // Use the BookController method directly
    const authResult = await (await import('@/controllers/AuthController')).AuthMiddleware.requireRole(['ADMIN', 'SUPER_ADMIN'])(req)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || undefined

    const result = await (await import('@/models/Book')).BookModel.getAdminBooks({
      status: status as any,
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
    console.error('Get books error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/books - Create new book (admin only)
async function createBookHandler(req: NextRequest) {
  try {
    return await BookController.createBook(req)
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(requireAdmin(getBooksHandler))
export const POST = requireAuth(requireAdmin(createBookHandler))