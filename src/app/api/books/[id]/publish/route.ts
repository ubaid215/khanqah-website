// src/app/api/books/[id]/publish/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { requireAdmin } from '@/middleware/auth'

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.publishBook(req, { params })
})