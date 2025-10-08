// src/app/api/users/[id]/status/route.ts
import { NextRequest } from 'next/server'
import { UserController } from '@/controllers/UserController'
import { requireAdmin } from '@/middleware/auth'

export const PUT = requireAdmin(async (req: NextRequest, { params }: { params: { id: string } }) => {
  return await UserController.updateUserStatus(req, { params })
})