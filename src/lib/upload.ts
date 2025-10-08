// src/lib/upload.ts
export async function uploadImage(file: File): Promise<{ url: string }> {
  // In a real application, you would upload to cloud storage like AWS S3, Cloudinary, etc.
  // For now, we'll create a mock upload that returns a blob URL
  return new Promise((resolve, reject) => {
    // Simulate upload delay
    setTimeout(() => {
      const url = URL.createObjectURL(file)
      resolve({ url })
    }, 1000)
  })
}

export function validateImage(file: File): string | null {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WebP, or GIF)'
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return 'Image must be less than 5MB'
  }

  return null
}