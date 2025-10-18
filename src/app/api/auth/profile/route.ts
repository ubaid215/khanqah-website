// src/app/api/auth/profile/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'
import { requireAuth } from '@/middleware/auth'
export const dynamic = 'force-dynamic'

export const GET = requireAuth(async (req: NextRequest) => {
  return await AuthController.getProfile(req)
})

export const PUT = requireAuth(async (req: NextRequest) => {
  return await AuthController.updateProfile(req)
})