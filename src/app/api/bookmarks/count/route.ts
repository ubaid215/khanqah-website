// src/app/api/bookmarks/count/route.ts
import { NextRequest } from 'next/server'
import { BookmarkController } from '@/controllers/BookmarkController'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  return await BookmarkController.getBookmarkCount(req)
}