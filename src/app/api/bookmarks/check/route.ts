// src/app/api/bookmarks/check/route.ts
import { NextRequest } from 'next/server'
import { BookmarkController } from '@/controllers/BookmarkController'
import { requireAuth } from '@/middleware/auth'
export const dynamic = 'force-dynamic'

export const GET = requireAuth(async (req: NextRequest) => {
  return await BookmarkController.checkBookmark(req)
})