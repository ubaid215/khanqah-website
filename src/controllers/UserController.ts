// src/controllers/UserController.ts
import { NextRequest, NextResponse } from 'next/server'
import { UserModel } from '@/models/User'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { UserRole, AccountStatus } from '@prisma/client'

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
      const role = searchParams.get('role') as UserRole | null
      const status = searchParams.get('status') as AccountStatus | null

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
      if (authResult.user!.id !== params.id && 
          !([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(authResult.user!.role)) {
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

      const updatedUser = await UserModel.updateUser(params.id, { role } as any)

      return ApiResponse.success(updatedUser, 'User role updated successfully')
    } catch (error) {
      console.error('Update user role error:', error)
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
}