// src/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { AuthMiddleware } from '@/controllers/AuthController'

export async function authMiddleware(req: NextRequest) {
  // Skip auth for public routes
  if (req.nextUrl.pathname.startsWith('/api/auth/login') ||
      req.nextUrl.pathname.startsWith('/api/auth/register') ||
      req.nextUrl.pathname.startsWith('/api/courses/public') ||
      req.nextUrl.pathname.startsWith('/api/articles/public') ||
      req.nextUrl.pathname.startsWith('/api/books/public') ||
      req.nextUrl.pathname.startsWith('/api/questions/public')) {
    return NextResponse.next()
  }

  const authResult = await AuthMiddleware.verifyAuth(req)
  if (authResult.error) {
    return NextResponse.json(
      { success: false, error: authResult.error },
      { status: 401 }
    )
  }

  // Add user to request headers for API routes to access
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-user-id', authResult.user!.id)
  requestHeaders.set('x-user-email', authResult.user!.email)
  requestHeaders.set('x-user-role', authResult.user!.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export function requireAuth(handler: Function) {
  return async (req: NextRequest, context?: any) => {
    const authResult = await AuthMiddleware.verifyAuth(req)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }
    return handler(req, context, authResult.user)
  }
}

export function requireRole(roles: string[]) {
  return (handler: Function) => {
    return async (req: NextRequest, context?: any) => {
      const authResult = await AuthMiddleware.requireRole(roles)(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }
      return handler(req, context, authResult.user)
    }
  }
}

// Export role-specific middleware
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN'])
export const requireSuperAdmin = requireRole(['SUPER_ADMIN'])