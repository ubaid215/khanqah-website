// src/app/api/books/[id]/download/route.ts
import { NextRequest } from 'next/server'
import { BookController } from '@/controllers/BookController'
import { withDownloadLimit } from '@/utils/download'

export const POST = withDownloadLimit(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookController.downloadBook(req, { params })
})