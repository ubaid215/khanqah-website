// src/app/api/auth/login/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'

export async function POST(req: NextRequest) {
  return await AuthController.login(req)
}