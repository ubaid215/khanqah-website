// src/lib/upload.ts
export async function uploadFile(file: File, progressCallback: (progress: number) => void): Promise<{ url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  const result = await response.json()
  
  if (!result.success || !result.data?.url) {
    throw new Error('Upload failed')
  }

  return { url: result.data.url }
}

export function validateImage(file: File): string | null {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Please select a valid image file'
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return 'Image must be less than 10MB'
  }

  return null
}

export function validateFile(file: File): string | null {
  const validTypes = ['application/pdf', 'application/epub+zip']
  if (!validTypes.includes(file.type)) {
    return 'Please select a PDF or EPUB file'
  }

  const maxSize = 50 * 1024 * 1024
  if (file.size > maxSize) {
    return 'File must be less than 50MB'
  }

  return null
}