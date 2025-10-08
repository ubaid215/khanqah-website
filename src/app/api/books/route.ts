// src/app/api/books/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { requireAdmin } from '@/middleware/auth'

export const GET = async (req: NextRequest) => {
  // Public access to published books
  const { searchParams } = new URL(req.url)
  if (searchParams.get('published') === 'true') {
    return await BookController.getPublishedBooks(req)
  }
  
  // Admin access to all books
  return requireAdmin(BookController.getAllBooks)(req)
}

export const POST = requireAdmin(async (req: NextRequest) => {
  return await BookController.createBook(req)
})

// Helper function for admin-only book listing
async function getAllBooks(req: NextRequest) {
  // This would call a method to get all books (including drafts)
  // For now, redirecting to published books
  return await BookController.getPublishedBooks(req)
}