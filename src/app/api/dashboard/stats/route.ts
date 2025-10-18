// src/app/api/dashboard/stats/route.ts
import { NextRequest } from 'next/server'
import { requireAdmin } from '@/middleware/auth'
export const dynamic = 'force-dynamic'

export const GET = requireAdmin(async (req: NextRequest) => {
  // Placeholder - implement dashboard stats
  return Response.json({
    success: true,
    data: {
      totalUsers: 0,
      totalCourses: 0,
      totalArticles: 0,
      totalBooks: 0,
      totalQuestions: 0,
      recentEnrollments: [],
      popularCourses: []
    }
  })
})