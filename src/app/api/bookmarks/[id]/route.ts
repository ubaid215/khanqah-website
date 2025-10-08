// src/app/api/bookmarks/[id]/route.ts
import { NextRequest } from 'next/server'
import { BookmarkController } from '@/controllers/BookmarkController'
import { requireAuth } from '@/middleware/auth'

export const DELETE = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await BookmarkController.deleteBookmark(req, { params })
})