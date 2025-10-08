// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AuthUser } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  // Use useCallback to memoize the function and prevent unnecessary re-renders
  const refreshUser = useCallback(async () => {
    try {
      const response = await apiClient.getProfile()
      if (response.success) {
        setUser(response.data)
        return true
      }
      return false
    } catch (error: any) {
      console.error('Failed to refresh user:', error)
      // Only clear user state if it's an auth error (401/403)
      if (error.status === 401 || error.status === 403) {
        setUser(null)
        localStorage.removeItem('token')
      }
      return false
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.user)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
    }
  }

  // Check authentication status on mount
  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const success = await refreshUser()
        // Only update state if component is still mounted
        if (mounted && !success) {
          setUser(null)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Don't remove token on network errors or other non-auth issues
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    // Cleanup function
    return () => {
      mounted = false
    }
  }, [refreshUser]) // Now refreshUser is properly memoized with useCallback

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}