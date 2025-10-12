// src/lib/edge-auth.ts
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-fallback-secret-change-in-production'
)

export interface EdgeUser {
  id: string
  email: string
  role: string
  status: string
}

export class EdgeAuth {
  static async verifyToken(token: string): Promise<EdgeUser | null> {
    try {
      console.log('🔐 [EdgeAuth] Verifying token...')
      
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Validate required fields
      if (!payload.userId || !payload.email || !payload.role) {
        console.log('❌ [EdgeAuth] Missing required fields in token')
        return null
      }

      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.log('❌ [EdgeAuth] Token expired')
        return null
      }

      const user: EdgeUser = {
        id: payload.userId as string,
        email: payload.email as string,
        role: payload.role as string,
        status: payload.status as string || 'ACTIVE'
      }

      console.log(`✅ [EdgeAuth] Token valid for user: ${user.email}`)
      return user

    } catch (error: any) {
      console.error('❌ [EdgeAuth] Token verification failed:', {
        name: error.name,
        message: error.message
      })
      return null
    }
  }

  static extractToken(request: Request): string | null {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.replace('Bearer ', '')
  }
}

// Client-side authentication utilities
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('❌ [getAuthToken] Error accessing localStorage:', error)
    return null
  }
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('token', token)
      console.log('✅ [setAuthToken] Token stored in localStorage')
    } catch (error) {
      console.error('❌ [setAuthToken] Error storing token in localStorage:', error)
    }
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('token')
      console.log('✅ [removeAuthToken] Token removed from localStorage')
    } catch (error) {
      console.error('❌ [removeAuthToken] Error removing token from localStorage:', error)
    }
  }
}

export function isAuthenticated(): boolean {
  const token = getAuthToken()
  return token !== null && token !== ''
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Utility to check if token is expired (client-side)
export function isTokenExpired(token: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // Simple check - decode without verification for expiration check only
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000 // Convert to milliseconds
    return Date.now() >= exp
  } catch (error) {
    console.error('❌ [isTokenExpired] Error checking token expiration:', error)
    return true // Consider expired if we can't check
  }
}

// Utility to get token payload (client-side, for display purposes only)
export function getTokenPayload(token: string): any {
  if (typeof window === 'undefined') return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
    }
  } catch (error) {
    console.error('❌ [getTokenPayload] Error decoding token:', error)
    return null
  }
}

// Utility to validate token structure (client-side)
export function isValidToken(token: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    return !!(payload.userId && payload.email && payload.role)
  } catch (error) {
    return false
  }
}

// Comprehensive token check for client-side use
export function checkAuthStatus(): {
  isAuthenticated: boolean
  token: string | null
  isExpired: boolean
  user: { id: string; email: string; role: string } | null
} {
  const token = getAuthToken()
  
  if (!token) {
    return {
      isAuthenticated: false,
      token: null,
      isExpired: true,
      user: null
    }
  }
  
  const isExpired = isTokenExpired(token)
  const payload = getTokenPayload(token)
  
  return {
    isAuthenticated: !isExpired && payload !== null,
    token: isExpired ? null : token,
    isExpired,
    user: payload ? {
      id: payload.userId,
      email: payload.email,
      role: payload.role
    } : null
  }
}