// src/app/admin/books/create/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { uploadFile, validateImage, validateFile } from '@/lib/upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toast } from '@/components/ui/toast'
import { 
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  FileText,
  Loader2,
  Eye,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { BookStatus } from '@/types'

// Define the form data type
interface BookFormData {
  title: string
  slug: string
  description: string
  author: string
  pages: number
  status: BookStatus
}

const initialFormData: BookFormData = {
  title: '',
  slug: '',
  description: '',
  author: '',
  pages: 0,
  status: BookStatus.DRAFT
}

// Define progress callback type
type UploadProgressCallback = (progress: number) => void;

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
  const [formData, setFormData] = useState<BookFormData>(initialFormData)
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description?: string
    variant: 'default' | 'destructive' | 'success'
  } | null>(null)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const showToast = (title: string, description?: string, variant: 'default' | 'destructive' | 'success' = 'default') => {
    setToast({ open: true, title, description, variant })
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setCoverImage('')
    setFileUrl('')
    setCoverError('')
    setFileError('')
    setSlugAvailable(null)
    setUploadProgress(0)
    if (coverInputRef.current) coverInputRef.current.value = ''
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Check if slug is available
  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      // Try to get book by slug - if it exists, slug is taken
      await apiClient.getBookBySlug(slug)
      setSlugAvailable(false)
    } catch (error: any) {
      // If we get a 404, the slug is available
      if (error.status === 404) {
        setSlugAvailable(true)
      } else {
        setSlugAvailable(null)
      }
    } finally {
      setCheckingSlug(false)
    }
  }

  // Debounced slug check
  useEffect(() => {
    if (formData.slug) {
      const timer = setTimeout(() => {
        checkSlugAvailability(formData.slug)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [formData.slug])

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.title || !formData.description || !formData.author || !formData.slug) {
      showToast('Validation Error', 'Please fill in all required fields.', 'destructive')
      return
    }

    // Check slug availability before submitting
    if (slugAvailable === false) {
      showToast('Slug Taken', 'This slug is already in use. Please choose a different one.', 'destructive')
      return
    }

    setIsLoading(true)

    try {
      const bookData = {
        ...formData,
        coverImage: coverImage || undefined,
        fileUrl: fileUrl || undefined,
        status: publish ? BookStatus.PUBLISHED : formData.status
      }
      
      console.log('📚 Submitting book:', bookData)
      
      const response = await apiClient.createBook(bookData)
      
      if (response && response.success) {
        const message = publish ? 'Book published successfully!' : 'Book saved as draft!'
        showToast('Success', message, 'success')
        
        // Reset form
        resetForm()
        
        // Redirect after a short delay to show the toast
        setTimeout(() => {
          router.push('/admin/books')
        }, 1500)
      } else {
        const errorMessage = (response as any)?.error || 'Failed to create book'
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      console.error('❌ Failed to create book:', error)
      
      // Handle specific error cases
      let errorMessage = 'Failed to create book. Please try again.'
      
      if (error.message?.includes('slug already exists')) {
        errorMessage = 'This slug is already taken. Please choose a different one.'
        setSlugAvailable(false)
      } else if (error.message) {
        errorMessage = error.message
      }
      
      showToast('Error', errorMessage, 'destructive')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveBook = (e: React.FormEvent) => {
    handleSubmit(e, false)
  }

  const handlePublish = (e: React.FormEvent) => {
    if (!formData.title || !formData.description || !formData.author || !formData.slug) {
      showToast('Validation Error', 'Please fill in all required fields before publishing.', 'destructive')
      return
    }

    if (slugAvailable === false) {
      showToast('Slug Taken', 'This slug is already in use. Please choose a different one.', 'destructive')
      return
    }
    
    if (!confirm('Are you sure you want to publish this book? It will be visible to all users.')) {
      return
    }
    
    handleSubmit(e, true)
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
    const newSlug = generateSlug(title)
    setFormData(prev => ({
      ...prev,
      title,
      slug: newSlug
    }))
  }

  const handleSlugChange = (slug: string) => {
    const cleanedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({
      ...prev,
      slug: cleanedSlug
    }))
    setSlugAvailable(null) // Reset availability check when slug changes
  }

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setCoverError(validationError)
      showToast('Upload Error', validationError, 'destructive')
      return
    }

    setCoverError('')
    setIsCoverUploading(true)

    try {
      // Create progress callback
      const progressCallback: UploadProgressCallback = (progress: number) => {
        setUploadProgress(progress)
      }
      
      const result = await uploadFile(file, progressCallback)
      setCoverImage(result.url)
      showToast('Success', 'Cover image uploaded successfully!', 'success')
    } catch (error: any) {
      console.error('Cover upload failed:', error)
      const errorMessage = error.message || 'Failed to upload cover image. Please try again.'
      setCoverError(errorMessage)
      showToast('Upload Error', errorMessage, 'destructive')
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

    // Validate file type for books (PDF, EPUB, etc.)
    const validationError = validateFile(file)
    if (validationError) {
      setFileError(validationError)
      showToast('Upload Error', validationError, 'destructive')
      return
    }

    // Show warning for large files
    if (file.size > 100 * 1024 * 1024) {
      showToast(
        'Large File Detected',
        `Uploading ${(file.size / (1024 * 1024)).toFixed(2)}MB. This may take several minutes.`,
        'default'
      )
    }

    setFileError('')
    setIsFileUploading(true)
    setUploadProgress(0)

    try {
      console.log('📤 Uploading book file to local server...')
      
      // Create progress callback
      const progressCallback: UploadProgressCallback = (progress: number) => {
        setUploadProgress(progress)
      }
      
      const result = await uploadFile(file, progressCallback)
      setFileUrl(result.url)
      showToast('Success', 'Book file uploaded successfully!', 'success')
      console.log('✅ Book file uploaded:', result.url)
    } catch (error: any) {
      console.error('❌ File upload failed:', error)
      const errorMessage = error.message || 'Failed to upload book file. Please try again.'
      setFileError(errorMessage)
      showToast('Upload Error', errorMessage, 'destructive')
    } finally {
      setIsFileUploading(false)
      setUploadProgress(0)
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

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          open={toast.open}
          onOpenChange={(open) => setToast(open ? toast : null)}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/books')}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upload New Book</h1>
            <p className="text-gray-600 mt-1">
              Add a new book to your library
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveBook}>
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
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <div className="relative">
                    <Input
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="book-slug"
                      required
                      disabled={isLoading}
                      className={slugAvailable === false ? 'border-red-300' : slugAvailable === true ? 'border-green-300' : ''}
                    />
                    {checkingSlug && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {slugAvailable === true && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {slugAvailable === false && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">
                      This will be used in the URL
                    </p>
                    {slugAvailable === true && (
                      <span className="text-xs text-green-600 font-medium">✓ Available</span>
                    )}
                    {slugAvailable === false && (
                      <span className="text-xs text-red-600 font-medium">✗ Already taken</span>
                    )}
                  </div>
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
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length} characters
                  </p>
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

                {!coverImage ? (
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
                        src={coverImage}
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

                {!fileUrl ? (
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
                  Supported formats: PDF, EPUB • Max size: 500MB
                </p>
              </CardContent>
            </Card>

            {/* Publish Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.description || !formData.author || !formData.slug || slugAvailable === false}
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
                    onClick={handlePublish}
                    disabled={isLoading || !formData.title || !formData.description || !formData.author || !formData.slug || slugAvailable === false}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Publish Book
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