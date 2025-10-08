// src/controllers/AuthController.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Response helper
export class ApiResponse {
  static success(data: any, message?: string, status: number = 200) {
    return NextResponse.json({
      success: true,
      data,
      message
    }, { status })
  }

  static error(error: string, status: number = 500) {
    return NextResponse.json({
      success: false,
      error
    }, { status })
  }

  static validationError(errors: Record<string, string>) {
    return NextResponse.json({
      success: false,
      error: "Validation failed",
      errors
    }, { status: 400 })
  }
}

// Auth middleware
export class AuthMiddleware {
  static async verifyAuth(req: NextRequest) {
    try {
      const token = this.extractTokenFromRequest(req)
      if (!token) {
        return { error: 'Authorization token required' }
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any
      const user = await UserModel.findById(decoded.userId)
      
      if (!user) {
        return { error: 'User not found' }
      }

      return { user, decoded }
    } catch (error) {
      return { error: 'Invalid token' }
    }
  }

  static requireRole(roles: UserRole[]) {
    return async (req: NextRequest) => {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return { error: authResult.error }
      }

      if (!roles.includes(authResult.user!.role)) {
        return { error: 'Insufficient permissions' }
      }

      return authResult
    }
  }

  static extractTokenFromRequest(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }
}

export class AuthController {
  static async register(req: NextRequest) {
    try {
      const { email, password, name, username } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!email) validationErrors.email = 'Email is required'
      if (!password) validationErrors.password = 'Password is required'
      if (!name) validationErrors.name = 'Name is required'
      
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        validationErrors.email = 'Invalid email format'
      }
      
      if (password && password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const user = await UserModel.create({
        email,
        password,
        name,
        username
      })

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      return ApiResponse.success(
        {
          user,
          token,
        },
        'Registration successful',
        201
      )
    } catch (error: any) {
      console.error('Registration error:', error)
      
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        return ApiResponse.error(error.message, 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async login(req: NextRequest) {
    try {
      const { email, password } = await req.json()

      // Validation
      if (!email || !password) {
        return ApiResponse.error('Email and password are required', 400)
      }

      // Find user
      const user = await UserModel.findByEmail(email)
      if (!user) {
        return ApiResponse.error('Invalid credentials', 401)
      }

      // Validate password
      const isValidPassword = await UserModel.validatePassword(password, user.password)
      if (!isValidPassword) {
        return ApiResponse.error('Invalid credentials', 401)
      }

      // Update last login
      await UserModel.updateLastLogin(user.id)

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )

      // Get user data without password
      const userData = await UserModel.findById(user.id)

      return ApiResponse.success(
        {
          user: userData,
          token,
        },
        'Login successful'
      )
    } catch (error) {
      console.error('Login error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async logout(req: NextRequest) {
    try {
      const token = AuthMiddleware.extractTokenFromRequest(req)
      if (token) {
        await UserModel.deleteSession(token)
      }

      return ApiResponse.success(null, 'Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getProfile(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      return ApiResponse.success(authResult.user, 'Profile retrieved successfully')
    } catch (error) {
      console.error('Get profile error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateProfile(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { name, image, bio, username } = await req.json()

      const updatedUser = await UserModel.updateUser(authResult.user!.id, {
        name,
        image,
        bio,
        username
      })

      return ApiResponse.success(updatedUser, 'Profile updated successfully')
    } catch (error: any) {
      console.error('Update profile error:', error)
      
      if (error.message.includes('already taken')) {
        return ApiResponse.error(error.message, 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async changePassword(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { currentPassword, newPassword } = await req.json()

      if (!currentPassword || !newPassword) {
        return ApiResponse.error('Current password and new password are required', 400)
      }

      if (newPassword.length < 6) {
        return ApiResponse.error('New password must be at least 6 characters', 400)
      }

      // Verify current password
      const user = await UserModel.findByEmail(authResult.user!.email)
      if (!user) {
        return ApiResponse.error('User not found', 404)
      }

      const isValidPassword = await UserModel.validatePassword(currentPassword, user.password)
      if (!isValidPassword) {
        return ApiResponse.error('Current password is incorrect', 400)
      }

      // Update password
      await UserModel.updatePassword(authResult.user!.id, newPassword)

      return ApiResponse.success(null, 'Password updated successfully')
    } catch (error) {
      console.error('Change password error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  // Admin only endpoints
  static async createAdmin(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { email, password, name, username, role = UserRole.ADMIN } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!email) validationErrors.email = 'Email is required'
      if (!password) validationErrors.password = 'Password is required'
      if (!name) validationErrors.name = 'Name is required'
      
      if (password && password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const user = await UserModel.create({
        email,
        password,
        name,
        username,
        role
      })

      return ApiResponse.success(
        user,
        'Admin created successfully',
        201
      )
    } catch (error: any) {
      console.error('Create admin error:', error)
      
      if (error.message.includes('already exists') || error.message.includes('already taken')) {
        return ApiResponse.error(error.message, 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async getAllAdmins(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const admins = await UserModel.getAllAdmins()

      return ApiResponse.success(admins, 'Admins retrieved successfully')
    } catch (error) {
      console.error('Get admins error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}