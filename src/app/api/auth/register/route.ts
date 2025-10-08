// src/app/api/auth/register/route.ts
import { NextRequest } from 'next/server'
import { AuthController } from '@/controllers/AuthController'

export async function POST(req: NextRequest) {
  return await AuthController.register(req)
}