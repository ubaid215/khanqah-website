// src/app/api/books/slug/[slug]/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  return await BookController.getBook(req, { params: { slug: params.slug } })
}