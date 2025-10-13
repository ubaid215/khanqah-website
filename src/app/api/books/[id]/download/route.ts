// src/app/api/books/[id]/download/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { withDownloadLimit } from '@/utils/download'

// Handle POST requests (with rate limiting)
export const POST = withDownloadLimit(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.downloadBook(req, { params })
})

// Handle GET requests (with rate limiting)
export const GET = withDownloadLimit(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.downloadBook(req, { params })
})