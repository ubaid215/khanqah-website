// src/app/admin/books/create/page.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { uploadImage, validateImage } from '@/lib/upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { 
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  FileText,
  Loader2,
  Eye,
  X
} from 'lucide-react'
import { BookStatus } from '@/types'

export default function CreateBookPage() {
  const router = useRouter()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [coverError, setCoverError] = useState('')
  const [fileError, setFileError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    author: '',
    pages: 0,
    status: BookStatus.DRAFT
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const bookData = {
        ...formData,
        coverImage: coverImage || undefined,
        fileUrl: fileUrl || undefined
      }
      
      const response = await apiClient.createBook(bookData)
      if (response.success) {
        router.push('/admin/books')
      }
    } catch (error: any) {
      console.error('Failed to create book:', error)
      alert(error.message || 'Failed to create book')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setCoverError(validationError)
      return
    }

    setCoverError('')
    setIsCoverUploading(true)

    try {
      const result = await uploadImage(file)
      setCoverImage(result.url)
    } catch (error) {
      console.error('Cover upload failed:', error)
      setCoverError('Failed to upload cover image. Please try again.')
    } finally {
      setIsCoverUploading(false)
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type for books (PDF, EPUB, etc.)
    const validTypes = ['application/pdf', 'application/epub+zip']
    if (!validTypes.includes(file.type)) {
      setFileError('Please select a valid book file (PDF or EPUB)')
      return
    }

    // Check file size (50MB max for books)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('Book file must be less than 50MB')
      return
    }

    setFileError('')
    setIsFileUploading(true)

    try {
      // In a real app, you'd upload to your file storage
      // For now, we'll simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      const mockUrl = URL.createObjectURL(file)
      setFileUrl(mockUrl)
    } catch (error) {
      console.error('File upload failed:', error)
      setFileError('Failed to upload book file. Please try again.')
    } finally {
      setIsFileUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveCover = () => {
    setCoverImage('')
    setCoverError('')
  }

  const handleRemoveFile = () => {
    setFileUrl('')
    setFileError('')
  }

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this book?')) return
    
    try {
      const bookData = {
        ...formData,
        coverImage: coverImage || undefined,
        fileUrl: fileUrl || undefined,
        status: BookStatus.PUBLISHED
      }
      
      const response = await apiClient.createBook(bookData)
      if (response.success) {
        router.push('/admin/books')
      }
    } catch (error: any) {
      console.error('Failed to publish book:', error)
      alert(error.message || 'Failed to publish book')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload New Book</h1>
            <p className="text-gray-600 mt-1">
              Add a new book to your library
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handlePublish}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Book Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Book Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="book-slug"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in the URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Book author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Book description and summary"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Pages
                  </label>
                  <Input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) }))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Settings */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Book Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BookStatus }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={BookStatus.DRAFT}>Draft</option>
                    <option value={BookStatus.PUBLISHED}>Published</option>
                    <option value={BookStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Cover Image Upload */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={coverInputRef}
                  onChange={handleCoverUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!coverImage ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {isCoverUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {isCoverUploading ? 'Uploading...' : 'Upload cover image'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300"
                      disabled={isCoverUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="Book cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                )}

                {coverError && (
                  <p className="text-sm text-red-600 mt-2">{coverError}</p>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Recommended: 400×600 pixels, JPEG/PNG format, max 5MB
                </p>
              </CardContent>
            </Card>

            {/* Book File Upload */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Book File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.epub"
                  className="hidden"
                />

                {!fileUrl ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isFileUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {isFileUploading ? 'Uploading...' : 'Upload book file'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300"
                      disabled={isFileUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 text-green-800">
                        <FileText className="h-5 w-5" />
                        <span className="font-medium">Book file uploaded successfully</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change File
                    </Button>
                  </div>
                )}

                {fileError && (
                  <p className="text-sm text-red-600 mt-2">{fileError}</p>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Supported formats: PDF, EPUB • Max size: 50MB
                </p>
              </CardContent>
            </Card>

            {/* Publish Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Book
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.push('/admin/books')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}