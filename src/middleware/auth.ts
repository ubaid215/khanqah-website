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

// Type definition for route handlers with context
type RouteContext<T = any> = {
  params: T
}

type RouteHandler<T = any> = (
  req: NextRequest,
  context: RouteContext<T>
) => Promise<NextResponse | Response>

// Fixed requireAuth function for Next.js App Router
export function requireAuth<T = any>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (req: NextRequest, context: RouteContext<T>) => {
    const authResult = await AuthMiddleware.verifyAuth(req)
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      )
    }
    
    // Call the handler with both request AND context
    return handler(req, context)
  }
}

// Fixed requireRole function for Next.js App Router
export function requireRole(roles: string[]) {
  return <T = any>(handler: RouteHandler<T>): RouteHandler<T> => {
    return async (req: NextRequest, context: RouteContext<T>) => {
      const authResult = await AuthMiddleware.requireRole(roles)(req)
      if (authResult.error) {
        return NextResponse.json(
          { success: false, error: authResult.error },
          { status: 403 }
        )
      }
      // Call the handler with both request AND context
      return handler(req, context)
    }
  }
}

// Export role-specific middleware
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN'])
export const requireSuperAdmin = requireRole(['SUPER_ADMIN'])