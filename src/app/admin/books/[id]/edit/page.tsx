// src/app/admin/books/[id]/edit/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { uploadFile, validateImage } from '@/lib/upload'
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
  X,
  Book
} from 'lucide-react'
import { BookWithRelations, BookStatus } from '@/types'

// Define progress callback type
type UploadProgressCallback = (progress: number) => void;

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string
  const coverInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isCoverUploading, setIsCoverUploading] = useState(false)
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [book, setBook] = useState<BookWithRelations | null>(null)
  const [coverError, setCoverError] = useState('')
  const [fileError, setFileError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    author: '',
    coverImage: '',
    fileUrl: '',
    pages: 0,
    status: BookStatus.DRAFT as BookStatus
  })

  useEffect(() => {
    fetchBook()
  }, [bookId])

  const fetchBook = async () => {
    try {
      const response = await apiClient.getBookById(bookId)
      if (response.success) {
        setBook(response.data || response) // Handle both response formats
        setFormData({
          title: response.data?.title || response.title,
          slug: response.data?.slug || response.slug,
          description: response.data?.description || response.description,
          author: response.data?.author || response.author,
          coverImage: response.data?.coverImage || response.coverImage || '',
          fileUrl: response.data?.fileUrl || response.fileUrl || '',
          pages: response.data?.pages || response.pages || 0,
          status: response.data?.status || response.status
        })
      }
    } catch (error) {
      console.error('Failed to fetch book:', error)
      alert('Failed to load book')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData = {
        ...formData
      }
      
      const response = await apiClient.updateBook(bookId, updateData)
      if (response.success) {
        router.push('/admin/books')
      }
    } catch (error: any) {
      console.error('Failed to update book:', error)
      alert(error.message || 'Failed to update book')
    } finally {
      setIsLoading(false)
    }
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
    setUploadProgress(0)

    try {
      // Create progress callback
      const progressCallback: UploadProgressCallback = (progress: number) => {
        setUploadProgress(progress)
      }
      
      const result = await uploadFile(file, progressCallback)
      setFormData(prev => ({ ...prev, coverImage: result.url }))
    } catch (error: any) {
      console.error('Cover upload failed:', error)
      setCoverError(error.message || 'Failed to upload cover image. Please try again.')
    } finally {
      setIsCoverUploading(false)
      setUploadProgress(0)
      if (coverInputRef.current) {
        coverInputRef.current.value = ''
      }
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['application/pdf', 'application/epub+zip']
    if (!validTypes.includes(file.type)) {
      setFileError('Please select a valid book file (PDF or EPUB)')
      return
    }

    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      setFileError('Book file must be less than 50MB')
      return
    }

    setFileError('')
    setIsFileUploading(true)
    setUploadProgress(0)

    try {
      // Create progress callback
      const progressCallback: UploadProgressCallback = (progress: number) => {
        setUploadProgress(progress)
      }
      
      const result = await uploadFile(file, progressCallback)
      setFormData(prev => ({ ...prev, fileUrl: result.url }))
    } catch (error: any) {
      console.error('File upload failed:', error)
      setFileError(error.message || 'Failed to upload book file. Please try again.')
    } finally {
      setIsFileUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveCover = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }))
    setCoverError('')
  }

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, fileUrl: '' }))
    setFileError('')
  }

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this book?')) return
    
    try {
      await apiClient.publishBook(bookId)
      router.push('/admin/books')
    } catch (error: any) {
      console.error('Failed to publish book:', error)
      alert(error.message || 'Failed to publish book')
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Book not found</h2>
        <Button
          onClick={() => router.push('/admin/books')}
          className="mt-4"
        >
          Back to Books
        </Button>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Book</h1>
            <p className="text-gray-600 mt-1">
              Update book information and files
            </p>
          </div>
        </div>
        
        {book.status !== BookStatus.PUBLISHED && (
          <Button
            onClick={handlePublish}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Book
          </Button>
        )}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter book title"
                    required
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Pages
                  </label>
                  <Input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={isLoading || isCoverUploading}
                />

                {!formData.coverImage ? (
                  <div 
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      !isLoading && !isCoverUploading ? 'hover:border-purple-500' : 'opacity-50'
                    }`}
                    onClick={() => !isLoading && !isCoverUploading && coverInputRef.current?.click()}
                  >
                    {isCoverUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                        {uploadProgress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload cover image
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-300"
                          disabled={isLoading || isCoverUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.coverImage}
                        alt="Book cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={isLoading || isCoverUploading}
                    >
                      Change Image
                    </Button>
                  </div>
                )}

                {coverError && (
                  <p className="text-sm text-red-600 mt-2">{coverError}</p>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Recommended: 400×600 pixels, JPEG/PNG format, max 10MB
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
                  disabled={isLoading || isFileUploading}
                />

                {!formData.fileUrl ? (
                  <div 
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      !isLoading && !isFileUploading ? 'hover:border-purple-500' : 'opacity-50'
                    }`}
                    onClick={() => !isLoading && !isFileUploading && fileInputRef.current?.click()}
                  >
                    {isFileUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                        {uploadProgress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                        <p className="text-sm text-gray-600">
                          Uploading... {uploadProgress > 0 ? `${uploadProgress}%` : ''}
                        </p>
                      </>
                    ) : (
                      <>
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload book file
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-gray-300"
                          disabled={isLoading || isFileUploading}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-green-800">
                          <FileText className="h-5 w-5" />
                          <span className="font-medium">Book file uploaded</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 text-green-700 hover:text-green-900 transition-colors"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-300"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || isFileUploading}
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

            {/* Actions */}
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
                    Update Book
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.push('/admin/books')}
                    disabled={isLoading}
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