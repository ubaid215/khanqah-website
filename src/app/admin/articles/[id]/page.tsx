// src/app/admin/articles/[id]/edit/page.tsx
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
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Eye,
  FileText
} from 'lucide-react'
import { ArticleWithRelations, ArticleStatus } from '@/types'

// Define progress callback type
type UploadProgressCallback = (progress: number) => void;

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [article, setArticle] = useState<ArticleWithRelations | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    thumbnail: '',
    readTime: 5,
    status: ArticleStatus.DRAFT as ArticleStatus 
  })

  useEffect(() => {
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    try {
      const response = await apiClient.getArticleById(articleId)
      if (response.success) {
        setArticle(response.data || response) // Handle both response formats
        setFormData({
          title: response.data?.title || response.title,
          slug: response.data?.slug || response.slug,
          content: response.data?.content || response.content,
          excerpt: response.data?.excerpt || response.excerpt || '',
          thumbnail: response.data?.thumbnail || response.thumbnail || '',
          readTime: response.data?.readTime || response.readTime || 5,
          status: response.data?.status || response.status
        })
        // Set tags from response
        if (response.data?.tags || response.tags) {
          const tagsData = response.data?.tags || response.tags
          setTags(tagsData.map((tag: any) => tag.tag?.name || tag.name || tag))
        }
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
      alert('Failed to load article')
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updateData = {
        ...formData,
        tagNames: tags
      }
      
      const response = await apiClient.updateArticle(articleId, updateData)
      if (response.success) {
        router.push('/admin/articles')
      }
    } catch (error: any) {
      console.error('Failed to update article:', error)
      alert(error.message || 'Failed to update article')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError('')
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create progress callback
      const progressCallback: UploadProgressCallback = (progress: number) => {
        setUploadProgress(progress)
      }
      
      const result = await uploadFile(file, progressCallback)
      setFormData(prev => ({ ...prev, thumbnail: result.url }))
    } catch (error: any) {
      console.error('Upload failed:', error)
      setUploadError(error.message || 'Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: '' }))
    setUploadError('')
  }

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this article?')) return
    
    try {
      await apiClient.publishArticle(articleId)
      router.push('/admin/articles')
    } catch (error: any) {
      console.error('Failed to publish article:', error)
      alert(error.message || 'Failed to publish article')
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Article not found</h2>
        <Button
          onClick={() => router.push('/admin/articles')}
          className="mt-4"
        >
          Back to Articles
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
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-gray-600 mt-1">
              Update article content and settings
            </p>
          </div>
        </div>
        
        {article.status !== ArticleStatus.PUBLISHED && (
          <Button
            onClick={handlePublish}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Article
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter article title"
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
                    placeholder="article-slug"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here..."
                    rows={12}
                    required
                    disabled={isLoading}
                  />
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
                    placeholder="Add a tag"
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
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
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

                {!formData.thumbnail ? (
                  <div 
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      !isLoading && !isUploading ? 'hover:border-green-500' : 'opacity-50'
                    }`}
                    onClick={() => !isLoading && !isUploading && fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                        {uploadProgress > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
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
                          Upload featured image
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
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={formData.thumbnail}
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

            {/* Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Update Article
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