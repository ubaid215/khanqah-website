// src/app/api/search/route.ts
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // This would implement search across all content types
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('q')
  const type = searchParams.get('type') || 'all'
  
  // Placeholder response - implement actual search logic
  return Response.json({
    success: true,
    data: {
      query,
      type,
      results: [],
      total: 0
    }
  })
}