// src/app/admin/articles/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/toast'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Loader2
} from 'lucide-react'
import { ArticleWithRelations, ArticleStatus } from '@/types'

export default function ArticlesPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<ArticleWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [toast, setToast] = useState<{
    open: boolean
    title: string
    description?: string
    variant: 'default' | 'destructive' | 'success'
  } | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [statusFilter]) // Refetch when status filter changes

  const showToast = (title: string, description?: string, variant: 'default' | 'destructive' | 'success' = 'default') => {
    setToast({ open: true, title, description, variant })
  }

  const fetchArticles = async () => {
  try {
    setIsLoading(true)
    console.log('📚 Fetching articles with filter:', statusFilter)
    
    const response = await apiClient.getArticles({ 
      status: statusFilter === 'all' ? undefined : statusFilter as ArticleStatus 
    })
    
    console.log('📚 Full API response:', response)
    
    if (response.success) {
      // Debug the response structure
      console.log('🔍 Response data structure:', {
        data: response.data,
        hasData: !!response.data,
        hasArticles: !!response.data?.articles,
        articlesType: typeof response.data?.articles,
        articlesLength: response.data?.articles?.length
      });

      // Extract articles from different possible structures
      let articlesData: ArticleWithRelations[] = [];
      
      if (response.data) {
        // Structure 1: response.data.articles (most common)
        if (response.data.articles && Array.isArray(response.data.articles)) {
          articlesData = response.data.articles;
          console.log('✅ Found articles in response.data.articles');
        }
        // Structure 2: response.data.data.articles (nested)
        else if (response.data.data && response.data.data.articles && Array.isArray(response.data.data.articles)) {
          articlesData = response.data.data.articles;
          console.log('✅ Found articles in response.data.data.articles');
        }
        // Structure 3: response.data is directly the array
        else if (Array.isArray(response.data)) {
          articlesData = response.data;
          console.log('✅ Found articles directly in response.data');
        }
        // Structure 4: Try to find any array in the response data
        else {
          // Look for any property that might be the articles array
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            articlesData = possibleArrays[0] as ArticleWithRelations[];
            console.log('✅ Found articles in nested array property');
          }
        }
      }

      console.log('📚 Final processed articles:', {
        count: articlesData.length,
        articles: articlesData.map(a => ({ id: a.id, title: a.title, status: a.status }))
      });
      
      setArticles(articlesData);
    } else {
      console.error('❌ API response not successful:', response)
      setArticles([])
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch articles:', error)
    showToast('Error', 'Failed to load articles', 'destructive')
    setArticles([])
  } finally {
    setIsLoading(false)
  }
}

  const handleWriteArticle = () => {
    router.push('/admin/articles/create')
  }

  const handleEditArticle = (articleId: string) => {
    router.push(`/admin/articles/edit/${articleId}`)
  }

  const handleViewArticle = (slug: string) => {
    window.open(`/articles/${slug}`, '_blank')
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      await apiClient.deleteArticle(articleId)
      setArticles(articles.filter(article => article.id !== articleId))
      showToast('Success', 'Article deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete article:', error)
      showToast('Error', 'Failed to delete article', 'destructive')
    }
  }

  const handlePublishArticle = async (articleId: string) => {
    try {
      await apiClient.publishArticle(articleId)
      await fetchArticles() // Refresh the list
      showToast('Success', 'Article published successfully', 'success')
    } catch (error) {
      console.error('Failed to publish article:', error)
      showToast('Error', 'Failed to publish article', 'destructive')
    }
  }

  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.PUBLISHED: return 'bg-green-100 text-green-800'
      case ArticleStatus.DRAFT: return 'bg-yellow-100 text-yellow-800'
      case ArticleStatus.ARCHIVED: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags?.some((tag: any) => 
                           tag.tag?.name.toLowerCase().includes(searchTerm.toLowerCase())
                         ) || false
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Article Management</h1>
          <p className="text-gray-600 mt-1">
            Write, edit, and manage your articles
          </p>
        </div>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleWriteArticle}
        >
          <Plus className="h-4 w-4 mr-2" />
          Write Article
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles by title, excerpt, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value={ArticleStatus.DRAFT}>Draft</option>
              <option value={ArticleStatus.PUBLISHED}>Published</option>
              <option value={ArticleStatus.ARCHIVED}>Archived</option>
            </select>
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={fetchArticles}
            >
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Articles ({filteredArticles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                {articles.length === 0 ? 'No articles have been created yet.' : 'No articles match your search criteria.'}
              </p>
              {articles.length === 0 && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleWriteArticle}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write Your First Article
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{article.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                      
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {article.tags.slice(0, 3).map((tag: any) => (
                            <span
                              key={tag.tag.id}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                            >
                              {tag.tag.name}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{article.readTime || 5} min read</span>
                        <span>{article.views || 0} views</span>
                        <span>{(article as any)._count?.bookmarks || 0} bookmarks</span>
                        {article.publishedAt && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300"
                      onClick={() => handleViewArticle(article.slug)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300"
                      onClick={() => handleEditArticle(article.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {article.status !== ArticleStatus.PUBLISHED && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-300 text-green-600 hover:text-green-700"
                        onClick={() => handlePublishArticle(article.id)}
                      >
                        Publish
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}