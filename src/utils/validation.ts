// src/middleware/validation.ts
import { NextRequest, NextResponse } from 'next/server'

export function validateBody(schema: any) {
  return (handler: Function) => {
    return async (req: NextRequest, context?: any) => {
      try {
        const body = await req.json()
        
        // Basic validation - in real app, use Zod or Yup
        const validationResult = schema.safeParse(body)
        if (!validationResult.success) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Validation failed',
              errors: validationResult.error.flatten() 
            },
            { status: 400 }
          )
        }
        
        // Create new request with validated body
        const validatedReq = new NextRequest(req, {
          body: JSON.stringify(validationResult.data)
        })
        
        return handler(validatedReq, context)
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON body' },
          { status: 400 }
        )
      }
    }
  }
}

export function validateQuery(schema: any) {
  return (handler: Function) => {
    return async (req: NextRequest, context?: any) => {
      const { searchParams } = new URL(req.url)
      const query = Object.fromEntries(searchParams.entries())
      
      const validationResult = schema.safeParse(query)
      if (!validationResult.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid query parameters',
            errors: validationResult.error.flatten() 
          },
          { status: 400 }
        )
      }
      
      return handler(req, context)
    }
  }
}