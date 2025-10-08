// src/app/api/users/[id]/route.ts
import { NextRequest } from 'next/server'
import { UserController } from '@/controllers/UserController'
import { requireAuth, requireSuperAdmin } from '@/middleware/auth'

export const GET = requireAuth(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await UserController.getUserById(req, { params })
})

export const PUT = requireSuperAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await UserController.updateUserRole(req, { params })
})

export const DELETE = requireSuperAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await UserController.deleteUser(req, { params })
})