// src/app/api/bookmarks/route.ts
import { NextRequest } from 'next/server'
import { BookmarkController } from '@/controllers/BookmarkController'
import { requireAuth } from '@/middleware/auth'

export const GET = requireAuth(async (req: NextRequest) => {
  return await BookmarkController.getUserBookmarks(req)
})

export const POST = requireAuth(async (req: NextRequest) => {
  return await BookmarkController.createBookmark(req)
})