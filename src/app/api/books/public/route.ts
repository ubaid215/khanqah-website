// src/app/api/books/public/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'

export async function GET(req: NextRequest) {
  return await BookController.getPublishedBooks(req)
}