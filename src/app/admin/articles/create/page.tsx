// src/app/admin/articles/create/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { uploadImage, validateImage } from '@/lib/upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Toast } from '@/components/ui/toast'
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Eye,
  Check,
  AlertCircle
} from 'lucide-react'
import { ArticleStatus } from '@/types'

// Define the form data type
interface ArticleFormData {
  title: string
  slug: string
  content: string
  excerpt: string
  readTime: number
  status: ArticleStatus
}

const initialFormData: ArticleFormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  readTime: 5,
  status: ArticleStatus.DRAFT
}

export default function CreateArticlePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [formData, setFormData] = useState<ArticleFormData>(initialFormData)
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description?: string
    variant: 'default' | 'destructive' | 'success'
  } | null>(null)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)

  const showToast = (title: string, description?: string, variant: 'default' | 'destructive' | 'success' = 'default') => {
    setToast({ open: true, title, description, variant })
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setTags([])
    setThumbnail('')
    setUploadError('')
    setSlugAvailable(null)
    setSlugTouched(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

// Check if slug is available
const checkSlugAvailability = async (slug: string) => {
  if (!slug || slug.length < 3) {
    setSlugAvailable(null)
    return
  }

  setCheckingSlug(true)
  try {
    // Use the dedicated slug availability check method
    const result = await apiClient.checkSlugAvailability(slug)
    setSlugAvailable(result.available)
  } catch (error: any) {
    console.error('Error checking slug availability:', error)
    // On error, set to null to show unknown state
    setSlugAvailable(null)
  } finally {
    setCheckingSlug(false)
  }
}

// Also update the useEffect for debounced checking:
useEffect(() => {
  if (formData.slug && slugTouched && formData.slug.length >= 3) {
    const timer = setTimeout(() => {
      checkSlugAvailability(formData.slug)
    }, 500)

    return () => clearTimeout(timer)
  } else if (!formData.slug || formData.slug.length < 3) {
    // Reset if slug is too short or empty
    setSlugAvailable(null)
  }
}, [formData.slug, slugTouched])

  // Debounced slug check
  useEffect(() => {
    if (formData.slug && slugTouched) {
      const timer = setTimeout(() => {
        checkSlugAvailability(formData.slug)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [formData.slug, slugTouched])

 
const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
  e.preventDefault()
  
  // Validate form
  if (!formData.title || !formData.content || !formData.slug) {
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
    const articleData = {
      ...formData,
      tagNames: tags,
      thumbnail: thumbnail || undefined,
      status: publish ? ArticleStatus.PUBLISHED : formData.status
    }
    
    console.log('📝 Submitting article:', articleData)
    
    const response = await apiClient.createArticle(articleData)
    
    console.log('📝 API Response:', response)
    
    // Improved response handling
    if (response && response.success === true) {
      const message = publish ? 'Article published successfully!' : 'Article saved as draft!'
      showToast('Success', message, 'success')
      
      // Reset form
      resetForm()
      
      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500)
    } else {
      // Handle API response that indicates failure
      const errorMessage = response?.error || response?.message || 'Failed to create article'
      
      // Handle slug conflict specifically
      if (errorMessage.toLowerCase().includes('slug') || errorMessage.includes('P2002')) {
        setSlugAvailable(false)
        showToast('Slug Taken', 'This slug is already taken. Please choose a different one.', 'destructive')
      } else {
        throw new Error(errorMessage)
      }
    }
  } catch (error: any) {
    console.error('❌ Failed to create article:', error)
    
    let errorMessage = 'Failed to create article. Please try again.'
    
    if (error.message?.includes('slug already exists') || error.code === 'P2002') {
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

  const handleSaveDraft = (e: React.FormEvent) => {
    handleSubmit(e, false)
  }

  const handlePublish = (e: React.FormEvent) => {
    if (!formData.title || !formData.content || !formData.slug) {
      showToast('Validation Error', 'Please fill in all required fields before publishing.', 'destructive')
      return
    }

    if (slugAvailable === false) {
      showToast('Slug Taken', 'This slug is already in use. Please choose a different one.', 'destructive')
      return
    }
    
    if (!confirm('Are you sure you want to publish this article? It will be visible to all users.')) {
      return
    }
    
    handleSubmit(e, true)
  }

  const handleAddTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
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
    if (!slugTouched) {
      setSlugTouched(true)
    }
  }

  const handleSlugChange = (slug: string) => {
    const cleanedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')
    setFormData(prev => ({
      ...prev,
      slug: cleanedSlug
    }))
    setSlugTouched(true)
    setSlugAvailable(null) // Reset availability check when slug changes
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setUploadError(validationError)
      showToast('Upload Error', validationError, 'destructive')
      return
    }

    setUploadError('')
    setIsUploading(true)

    try {
      const result = await uploadImage(file)
      setThumbnail(result.url)
      showToast('Success', 'Image uploaded successfully!', 'success')
    } catch (error) {
      console.error('Upload failed:', error)
      const errorMessage = 'Failed to upload image. Please try again.'
      setUploadError(errorMessage)
      showToast('Upload Error', errorMessage, 'destructive')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnail('')
    setUploadError('')
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
            onClick={() => router.push('/admin/articles')}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Write New Article</h1>
            <p className="text-gray-600 mt-1">
              Create and publish a new article
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveDraft}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Article Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter article title"
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
                      placeholder="article-slug"
                      required
                      disabled={isLoading}
                      className={
                        slugAvailable === false 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : slugAvailable === true 
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500' 
                          : ''
                      }
                    />
                    {checkingSlug && (
                      <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                    {slugAvailable === true && !checkingSlug && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                    {slugAvailable === false && !checkingSlug && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-gray-500">
                      This will be used in the URL. Only lowercase letters, numbers, and hyphens are allowed.
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
                    Excerpt
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article (appears in article previews)"
                    rows={3}
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.excerpt.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here... You can use Markdown formatting."
                    rows={12}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.content.length} characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (press Enter to add)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 hover:text-green-600 disabled:opacity-50"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Add relevant tags to help users discover your article.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Settings */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Article Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      status: e.target.value as ArticleStatus 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={isLoading}
                  >
                    <option value={ArticleStatus.DRAFT}>Draft</option>
                    <option value={ArticleStatus.PUBLISHED}>Published</option>
                    <option value={ArticleStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      readTime: parseInt(e.target.value) || 5 
                    }))}
                    placeholder="5"
                    min="1"
                    max="60"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading || isUploading}
                />

                {!thumbnail ? (
                  <div 
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      !isLoading && !isUploading ? 'hover:border-green-500' : 'opacity-50'
                    }`}
                    onClick={() => !isLoading && !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600 mb-2">
                      {isUploading ? 'Uploading...' : 'Upload featured image'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-300"
                      disabled={isLoading || isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={thumbnail}
                        alt="Article thumbnail"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveThumbnail}
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
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || isUploading}
                    >
                      Change Image
                    </Button>
                  </div>
                )}

                {uploadError && (
                  <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                )}

                <p className="text-xs text-gray-500 mt-3">
                  Recommended: 1200×630 pixels, JPEG/PNG format, max 5MB
                </p>
              </CardContent>
            </Card>

            {/* Publish Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.title || !formData.content || !formData.slug || slugAvailable === false}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Draft
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handlePublish}
                    disabled={isLoading || !formData.title || !formData.content || !formData.slug || slugAvailable === false}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Publish Article
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.push('/admin/articles')}
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