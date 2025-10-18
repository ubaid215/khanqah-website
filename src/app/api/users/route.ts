// src/app/api/users/route.ts
import { NextRequest } from 'next/server'
import { UserController } from '@/controllers/UserController'
import { requireAdmin } from '@/middleware/auth'
export const dynamic = 'force-dynamic'

export const GET = requireAdmin(async (req: NextRequest) => {
  return await UserController.getAllUsers(req)
})