// src/app/api/books/[id]/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { requireAdmin } from '@/middleware/auth'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return await BookController.getBook(req, { params })
}

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.updateBook(req, { params })
})

export const DELETE = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.deleteBook(req, { params })
})