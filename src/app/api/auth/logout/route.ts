// src/app/api/auth/logout/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'
import { requireAuth } from '@/middleware/auth'

export const POST = requireAuth(async (req: NextRequest) => {
  return await AuthController.logout(req)
})