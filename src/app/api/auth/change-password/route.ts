// src/app/api/auth/change-password/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'
import { requireAuth } from '@/middleware/auth'

export const PUT = requireAuth(async (req: NextRequest) => {
  return await AuthController.changePassword(req)
})