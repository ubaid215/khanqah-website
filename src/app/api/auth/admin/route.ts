// src/app/api/auth/admin/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'
import { requireSuperAdmin } from '@/middleware/auth'

export const POST = requireSuperAdmin(async (req: NextRequest) => {
  return await AuthController.createAdmin(req)
})

export const GET = requireSuperAdmin(async (req: NextRequest) => {
  return await AuthController.getAllAdmins(req)
})