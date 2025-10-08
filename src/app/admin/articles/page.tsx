// src/app/admin/articles/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
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

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await apiClient.getArticles({ 
        status: statusFilter === 'all' ? undefined : statusFilter as ArticleStatus 
      })
      if (response.success) {
        setArticles(response.data?.articles || [])
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWriteArticle = () => {
    router.push('/admin/articles/create')
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      await apiClient.deleteArticle(articleId)
      setArticles(articles.filter(article => article.id !== articleId))
    } catch (error) {
      console.error('Failed to delete article:', error)
      alert('Failed to delete article')
    }
  }

  const handlePublishArticle = async (articleId: string) => {
    try {
      await apiClient.publishArticle(articleId)
      await fetchArticles() // Refresh the list
    } catch (error) {
      console.error('Failed to publish article:', error)
      alert('Failed to publish article')
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
                         false
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
                placeholder="Search articles..."
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
              Apply
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
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{article.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{article.readTime} min read</span>
                      <span>{article.views} views</span>
                      <span>{article._count?.bookmarks || 0} bookmarks</span>
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
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300">
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
        </CardContent>
      </Card>
    </div>
  )
}