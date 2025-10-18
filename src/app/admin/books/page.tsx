// src/app/admin/books/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Book, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  FileText,
  Loader2
} from 'lucide-react'
import { BookWithRelations, BookStatus } from '@/types'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<BookWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
  try {
    const response = await apiClient.getBooks({ 
      status: statusFilter === 'all' ? undefined : statusFilter as BookStatus 
    })
    
    if (response.success) {
      // Handle different possible response structures
      let booksData: BookWithRelations[] = []
      
      if (Array.isArray(response.data)) {
        // Direct array response
        booksData = response.data
      } else if (response.data && Array.isArray(response.data.books)) {
        // Paginated response with books array
        booksData = response.data.books
      } else if (response.data && Array.isArray(response.data.data)) {
        // Alternative data structure
        booksData = response.data.data
      }
      
      setBooks(booksData)
    } else {
      setBooks([])
    }
  } catch (error) {
    console.error('Failed to fetch books:', error)
    setBooks([])
  } finally {
    setIsLoading(false)
  }
}

  const handleUploadBook = () => {
    router.push('/admin/books/create')
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return
    
    try {
      await apiClient.deleteBook(bookId)
      setBooks(books.filter(book => book.id !== bookId))
    } catch (error) {
      console.error('Failed to delete book:', error)
      alert('Failed to delete book')
    }
  }

  const handlePublishBook = async (bookId: string) => {
    try {
      await apiClient.publishBook(bookId)
      await fetchBooks() // Refresh the list
    } catch (error) {
      console.error('Failed to publish book:', error)
      alert('Failed to publish book')
    }
  }

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case BookStatus.PUBLISHED: return 'bg-green-100 text-green-800'
      case BookStatus.DRAFT: return 'bg-yellow-100 text-yellow-800'
      case BookStatus.ARCHIVED: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
          <p className="text-gray-600 mt-1">
            Upload, edit, and manage your books
          </p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleUploadBook}
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Book
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value={BookStatus.DRAFT}>Draft</option>
              <option value={BookStatus.PUBLISHED}>Published</option>
              <option value={BookStatus.ARCHIVED}>Archived</option>
            </select>
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={fetchBooks}
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Books ({filteredBooks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Book className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{book.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(book.status)}`}>
                        {book.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                    <p className="text-sm text-gray-600 mb-2">{book.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {book.pages} pages
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {book.downloads} downloads
                      </span>
                      <span>{book._count?.bookmarks || 0} bookmarks</span>
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
                  {book.status !== BookStatus.PUBLISHED && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300 text-green-600 hover:text-green-700"
                      onClick={() => handlePublishBook(book.id)}
                    >
                      Publish
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteBook(book.id)}
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