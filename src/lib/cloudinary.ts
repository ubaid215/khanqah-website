// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload to Cloudinary
export async function uploadToCloudinary(
  file: File | Buffer | string,
  options: {
    folder?: string
    resource_type?: 'image' | 'video' | 'raw' | 'auto'
    public_id?: string
    transformation?: any[]
  } = {}
): Promise<{ url: string; public_id: string; secure_url: string; format: string; resource_type: string }> {
  try {
    const {
      folder = 'lms',
      resource_type = 'auto',
      public_id,
      transformation = []
    } = options

    let uploadStream: Buffer | string

    if (file instanceof File) {
      // Convert File to Buffer for Node.js environment
      const arrayBuffer = await file.arrayBuffer()
      uploadStream = Buffer.from(arrayBuffer)
    } else {
      uploadStream = file
    }

    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type,
        transformation,
        timeout: 60000 // 60 seconds timeout for large files
      }

      if (public_id) {
        uploadOptions.public_id = public_id
      }

      if (resource_type === 'image') {
        // Optimize images
        uploadOptions.quality = 'auto'
        uploadOptions.fetch_format = 'auto'
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(new Error(`Upload failed: ${error.message}`))
          } else if (result) {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              secure_url: result.secure_url,
              format: result.format,
              resource_type: result.resource_type
            })
          } else {
            reject(new Error('Upload failed: No result returned'))
          }
        }
      )

      if (file instanceof File) {
        file.arrayBuffer().then(arrayBuffer => {
          uploadStream.end(Buffer.from(arrayBuffer))
        })
      } else if (typeof file === 'string') {
        // For base64 or URL
        uploadStream.end(file)
      } else {
        // For Buffer
        uploadStream.end(file)
      }
    })
  } catch (error) {
    console.error('Cloudinary upload exception:', error)
    throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Delete from Cloudinary
export async function deleteFromCloudinary(public_id: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(public_id)
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error(`Delete failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(public_id: string, transformations: any[] = []) {
  return cloudinary.url(public_id, {
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      ...transformations
    ]
  })
}

// Generate video thumbnail URL
export function getVideoThumbnailUrl(public_id: string) {
  return cloudinary.url(public_id, {
    resource_type: 'video',
    transformation: [
      { width: 320, height: 180, crop: 'fill' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  })
}

// Get video streaming URL
export function getVideoStreamUrl(public_id: string) {
  return cloudinary.url(public_id, {
    resource_type: 'video',
    transformation: [
      { streaming_profile: 'full_hd' },
      { quality: 'auto' }
    ]
  })
}