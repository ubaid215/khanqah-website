// src/middleware/download.ts
import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting (use Redis in production)
const downloadAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function withDownloadLimit(handler: Function) {
  return async (req: NextRequest, context?: any) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const oneHour = 60 * 60 * 1000
    
    const userAttempts = downloadAttempts.get(ip) || { count: 0, lastAttempt: 0 }
    
    // Reset counter if last attempt was more than 1 hour ago
    if (now - userAttempts.lastAttempt > oneHour) {
      userAttempts.count = 0
    }
    
    // Limit to 10 downloads per hour per IP
    if (userAttempts.count >= 10) {
      return NextResponse.json(
        { success: false, error: 'Download limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Update attempt count
    userAttempts.count++
    userAttempts.lastAttempt = now
    downloadAttempts.set(ip, userAttempts)
    
    return handler(req, context)
  }
}