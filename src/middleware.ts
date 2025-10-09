// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

export async function middleware(request: NextRequest) {
  // Skip auth for public routes
  if (request.nextUrl.pathname.startsWith('/api/auth/login') ||
      request.nextUrl.pathname.startsWith('/api/auth/register') ||
      request.nextUrl.pathname.startsWith('/api/courses/public') ||
      request.nextUrl.pathname.startsWith('/api/articles/public') ||
      request.nextUrl.pathname.startsWith('/api/books/public') ||
      request.nextUrl.pathname.startsWith('/api/questions/public')) {
    return NextResponse.next()
  }

  // For protected routes, let the API routes handle authentication
  // We'll just pass through and the API routes will validate the token
  return NextResponse.next()
}