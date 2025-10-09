import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/middleware/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const POST = requireAuth(async (req: NextRequest, context: any, user?: any) => {
  console.log('🟢 [UPLOAD_ROUTE] Request received');

  try {
    // Check authentication
    if (!user) {
      console.warn('🔴 [UPLOAD_ROUTE] Unauthorized attempt to upload file');
      return Response.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log(`👤 [UPLOAD_ROUTE] Authenticated user: ${user.email} (role: ${user.role}, id: ${user.id})`)

    // Parse form data
    console.log('📦 [UPLOAD_ROUTE] Extracting form data...')
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.warn('⚠️ [UPLOAD_ROUTE] No file provided in form data')
      return Response.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`🧾 [UPLOAD_ROUTE] File received: ${file.name} (${file.type}, ${file.size} bytes)`)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      console.warn(`⚠️ [UPLOAD_ROUTE] Invalid file type: ${file.type}`)
      return Response.json(
        { success: false, error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      console.warn(`⚠️ [UPLOAD_ROUTE] File too large: ${file.size} bytes`)
      return Response.json(
        { success: false, error: 'File size must be less than 5MB' },
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
    const filename = `${user.id}-${timestamp}-${originalName}`
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
    console.log(`🎉 [UPLOAD_ROUTE] Upload complete for user ${user.email}`)
    return Response.json({
      success: true,
      data: {
        url: fileUrl,
        filename: file.name,
        size: file.size,
        mimetype: file.type,
        uploadedBy: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })

  } catch (error) {
    console.error('💥 [UPLOAD_ROUTE] Unexpected error during upload:', error)
    return Response.json(
      { success: false, error: 'Upload failed', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
})

// OPTIONS for CORS preflight
export const OPTIONS = async () => {
  console.log('⚙️ [UPLOAD_ROUTE] Handling OPTIONS (CORS preflight)')
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
