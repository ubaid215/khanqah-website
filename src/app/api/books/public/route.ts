// src/app/api/books/public/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BookController } from '@/controllers/BookController'
export const dynamic = 'force-dynamic'

// GET /api/books/public - Get published books (public)
export async function GET(req: NextRequest) {
  try {
    return await BookController.getPublishedBooks(req)
  } catch (error) {
    console.error('Get public books error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}