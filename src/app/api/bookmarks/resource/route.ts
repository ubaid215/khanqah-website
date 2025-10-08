// src/app/api/bookmarks/resource/route.ts
import { NextRequest } from 'next/server'
import { BookmarkController } from '@/controllers/BookmarkController'
import { requireAuth } from '@/middleware/auth'

export const DELETE = requireAuth(async (req: NextRequest) => {
  return await BookmarkController.deleteBookmarkByResource(req)
})