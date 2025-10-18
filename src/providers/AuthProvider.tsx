// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AuthUser } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: { name: string; email: string; password: string; username?: string }) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
   updateUser: (userData: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

const storage = {
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  setUser: (user: AuthUser | null): void => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = !!user

  const register = async (data: { name: string; email: string; password: string; username?: string }) => {
    setIsLoading(true)
    try {
      const response = await apiClient.register(data)
      if (response.user) {
        setUser(response.user)
        storage.setUser(response.user)
      }
    } catch (error) {
      storage.clear()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const response = await apiClient.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token === localStorage.getItem('token')) {
          localStorage.setItem('user', JSON.stringify(response.data))
        } else {
          sessionStorage.setItem('user', JSON.stringify(response.data))
        }
        return
      }
      // If no success, clear auth data
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')
      }
    } catch (error: any) {
      console.error('Failed to refresh user:', error)
      if (error.status === 401 || error.status === 403) {
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    }
  }, [])

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    setIsLoading(true)
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.user)
      storage.setUser(response.user)
      
      // Handle remember me functionality
      if (rememberMe !== undefined) {
        localStorage.setItem('rememberMe', rememberMe.toString())
      }
    } catch (error) {
      storage.clear()
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<AuthUser>) => {
  setUser(prev => prev ? { ...prev, ...userData } : null)
  if (userData) {
    const currentUser = storage.getUser()
    if (currentUser) {
      storage.setUser({ ...currentUser, ...userData })
    }
  }
}

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      storage.clear()
    }
  }

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setIsLoading(false)
        return
      }

      if (user && !token) {
        setUser(null)
        storage.clear()
        setIsLoading(false)
        return
      }

      try {
        await refreshUser()
      } catch (error) {
        console.error('Auth check failed:', error)
        if (mounted) {
          setUser(null)
          storage.clear()
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [refreshUser])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register, 
    logout,
    refreshUser,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}