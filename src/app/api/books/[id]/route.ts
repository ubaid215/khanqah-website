// src/app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { requireAuth, requireAdmin } from '@/middleware/auth'

// GET /api/books/[id] - Get specific book
async function getBookHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    return await BookController.getBook(req, { params: { slug: params.id } })
  } catch (error) {
    console.error('Get book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/books/[id] - Update book
async function updateBookHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    return await BookController.updateBook(req, { params })
  } catch (error) {
    console.error('Update book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/books/[id] - Delete book
async function deleteBookHandler(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    return await BookController.deleteBook(req, { params })
  } catch (error) {
    console.error('Delete book error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = requireAuth(requireAdmin(getBookHandler))
export const PUT = requireAuth(requireAdmin(updateBookHandler))
export const DELETE = requireAuth(requireAdmin(deleteBookHandler))