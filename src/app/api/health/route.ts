// src/app/api/health/route.ts
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return Response.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  })
}