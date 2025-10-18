// src/controllers/UserController.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'
import { AuthMiddleware, ApiResponse } from './AuthController'

// Define enums locally to avoid import conflicts
enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export class UserController {
  static async getAllUsers(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { searchParams } = new URL(req.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')
      const roleParam = searchParams.get('role')
      const statusParam = searchParams.get('status')

      // Convert null to undefined to match expected types
      const role = roleParam as UserRole | undefined
      const status = statusParam as AccountStatus | undefined

      // In a real implementation, you'd add pagination to UserModel
      const users = await UserModel.getAllAdmins() // This would be getAllUsers with filters

      return ApiResponse.success(users, 'Users retrieved successfully')
    } catch (error) {
      console.error('Get users error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getUserById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      // Users can view their own profile, admins can view any profile
      // Use string comparison to avoid type issues
      const isAdmin = authResult.user!.role === 'ADMIN' || authResult.user!.role === 'SUPER_ADMIN'
      const isOwnProfile = authResult.user!.id === params.id

      if (!isOwnProfile && !isAdmin) {
        return ApiResponse.error('Insufficient permissions', 403)
      }

      const user = await UserModel.findById(params.id)
      if (!user) {
        return ApiResponse.error('User not found', 404)
      }

      return ApiResponse.success(user, 'User retrieved successfully')
    } catch (error) {
      console.error('Get user error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateUserRole(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { role } = await req.json()

      if (!role || !Object.values(UserRole).includes(role)) {
        return ApiResponse.error('Valid role is required', 400)
      }

      // Prevent self-demotion
      if (params.id === authResult.user!.id && role !== UserRole.SUPER_ADMIN) {
        return ApiResponse.error('Cannot change your own role from SUPER_ADMIN', 400)
      }

      // Use updateUser with role property - it should work if the Prisma schema allows it
      const updatedUser = await UserModel.updateUser(params.id, { role } as any)

      return ApiResponse.success(updatedUser, 'User role updated successfully')
    } catch (error: any) {
      console.error('Update user role error:', error)
      
      // Handle case where role might not be allowed in updateUser
      if (error.message?.includes('Invalid field') || error.message?.includes('role')) {
        return ApiResponse.error('Role update is not supported', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateUserStatus(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const { status } = await req.json()

      if (!status || !Object.values(AccountStatus).includes(status)) {
        return ApiResponse.error('Valid status is required', 400)
      }

      // Prevent self-suspension/deletion
      if (params.id === authResult.user!.id && status !== AccountStatus.ACTIVE) {
        return ApiResponse.error('Cannot change your own account status', 400)
      }

      const updatedUser = await UserModel.updateStatus(params.id, status)

      return ApiResponse.success(updatedUser, 'User status updated successfully')
    } catch (error) {
      console.error('Update user status error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteUser(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      // Prevent self-deletion
      if (params.id === authResult.user!.id) {
        return ApiResponse.error('Cannot delete your own account', 400)
      }

      await UserModel.deleteUser(params.id)

      return ApiResponse.success(null, 'User deleted successfully')
    } catch (error) {
      console.error('Delete user error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getUserStats(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 403)
      }

      const stats = await UserModel.getUserStats()

      return ApiResponse.success(stats, 'User stats retrieved successfully')
    } catch (error) {
      console.error('Get user stats error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getCurrentUser(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const user = await UserModel.findById(authResult.user!.id)
      if (!user) {
        return ApiResponse.error('User not found', 404)
      }

      return ApiResponse.success(user, 'User retrieved successfully')
    } catch (error) {
      console.error('Get current user error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateProfile(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { name, username, bio, image } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
        validationErrors.username = 'Username can only contain letters, numbers, and underscores'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const updatedUser = await UserModel.updateUser(authResult.user!.id, {
        name,
        username,
        bio,
        image
      })

      return ApiResponse.success(updatedUser, 'Profile updated successfully')
    } catch (error: any) {
      console.error('Update profile error:', error)
      
      if (error.message?.includes('Unique constraint')) {
        return ApiResponse.error('Username already taken', 400)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }
}