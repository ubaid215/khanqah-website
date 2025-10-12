// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { AuthMiddleware } from '@/controllers/AuthController'

export async function POST(req: NextRequest) {
  console.log('🟢 [UPLOAD_ROUTE] Request received');

  try {
    let userId: string | null = null
    let userEmail: string | null = null
    let userRole: string | null = null

    // Try to get user from headers first (set by middleware)
    userId = req.headers.get('x-user-id')
    userEmail = req.headers.get('x-user-email')
    userRole = req.headers.get('x-user-role')

    // If headers are not set, try to authenticate directly
    if (!userId || !userEmail) {
      console.log('🔄 [UPLOAD_ROUTE] No user headers found, authenticating directly...')
      const authResult = await AuthMiddleware.verifyAuth(req)
      
      if (authResult.error || !authResult.user) {
        console.warn('🔴 [UPLOAD_ROUTE] Direct authentication failed:', authResult.error)
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        )
      }

      userId = authResult.user.id
      userEmail = authResult.user.email
      userRole = authResult.user.role
      console.log(`👤 [UPLOAD_ROUTE] Direct authentication successful: ${userEmail}`)
    } else {
      console.log(`👤 [UPLOAD_ROUTE] User from headers: ${userEmail} (role: ${userRole}, id: ${userId})`)
    }

    // Parse form data
    console.log('📦 [UPLOAD_ROUTE] Extracting form data...')
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.warn('⚠️ [UPLOAD_ROUTE] No file provided in form data')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`🧾 [UPLOAD_ROUTE] File received: ${file.name} (${file.type}, ${file.size} bytes)`)

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp', 
      'image/gif',
      'video/mp4',
      'video/mpeg',
      'video/ogg',
      'video/webm',
      'video/quicktime',
      'application/pdf'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      console.warn(`⚠️ [UPLOAD_ROUTE] Invalid file type: ${file.type}`)
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images, videos, and PDFs are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB for videos, 5MB for images/PDFs)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.warn(`⚠️ [UPLOAD_ROUTE] File too large: ${file.size} bytes`)
      const maxSizeMB = maxSize / (1024 * 1024)
      return NextResponse.json(
        { success: false, error: `File size must be less than ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    console.log('🔄 [UPLOAD_ROUTE] Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ [UPLOAD_ROUTE] File converted to buffer successfully')

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public/uploads')
    if (!existsSync(uploadsDir)) {
      console.log('📂 [UPLOAD_ROUTE] Uploads directory not found, creating...')
      await mkdir(uploadsDir, { recursive: true })
      console.log('✅ [UPLOAD_ROUTE] Uploads directory created')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${userId}-${timestamp}-${originalName}`
    const filepath = join(uploadsDir, filename)
    console.log(`🧩 [UPLOAD_ROUTE] Generated filename: ${filename}`)

    // Write file to disk
    console.log('💾 [UPLOAD_ROUTE] Writing file to filesystem...')
    await writeFile(filepath, buffer)
    console.log(`✅ [UPLOAD_ROUTE] File saved successfully at: ${filepath}`)

    // Construct public URL
    const fileUrl = `/uploads/${filename}`
    console.log(`🌍 [UPLOAD_ROUTE] Public file URL: ${fileUrl}`)

    // Success response
    console.log(`🎉 [UPLOAD_ROUTE] Upload complete for user ${userEmail}`)
    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        filename: file.name,
        size: file.size,
        mimetype: file.type,
        uploadedBy: {
          id: userId,
          email: userEmail,
          role: userRole
        }
      }
    })

  } catch (error) {
    console.error('💥 [UPLOAD_ROUTE] Unexpected error during upload:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  console.log('⚙️ [UPLOAD_ROUTE] Handling OPTIONS (CORS preflight)')
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}