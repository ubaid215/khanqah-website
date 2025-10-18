// src/app/admin/questions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  HelpCircle, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { QuestionWithRelations, QuestionStatus } from '@/types'

export default function QuestionsPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuestionWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
  try {
    const response = await apiClient.getQuestions()
    if (response.success) {
      // Handle different possible response structures
      if (Array.isArray(response.data)) {
        setQuestions(response.data)
      } else if (response.data && Array.isArray(response.data.data)) {
        setQuestions(response.data.data)
      } else {
        setQuestions([])
      }
    } else {
      setQuestions([])
    }
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    setQuestions([])
  } finally {
    setIsLoading(false)
  }
}

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      await apiClient.deleteQuestion(questionId)
      setQuestions(questions.filter(question => question.id !== questionId))
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question')
    }
  }

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await apiClient.acceptAnswer(answerId)
      await fetchQuestions() // Refresh to show accepted answer
    } catch (error) {
      console.error('Failed to accept answer:', error)
      alert('Failed to accept answer')
    }
  }

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case QuestionStatus.ANSWERED: return 'bg-green-100 text-green-800'
      case QuestionStatus.OPEN: return 'bg-blue-100 text-blue-800'
      case QuestionStatus.CLOSED: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case QuestionStatus.ANSWERED: return <CheckCircle className="h-4 w-4" />
      case QuestionStatus.OPEN: return <HelpCircle className="h-4 w-4" />
      case QuestionStatus.CLOSED: return <XCircle className="h-4 w-4" />
      default: return <HelpCircle className="h-4 w-4" />
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || question.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Management</h1>
          <p className="text-gray-600 mt-1">
            Manage community questions and answers
          </p>
        </div>
        {/* <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => router.push('/admin/questions/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask Question
        </Button> */}
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value={QuestionStatus.OPEN}>Open</option>
              <option value={QuestionStatus.ANSWERED}>Answered</option>
              <option value={QuestionStatus.CLOSED}>Closed</option>
            </select>
            <Button variant="outline" className="border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Questions ({filteredQuestions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <HelpCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {question.title}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(question.status)}`}>
                        {getStatusIcon(question.status)}
                        <span className="ml-1">{question.status.toLowerCase()}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {question.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {question.user.name}</span>
                      <span>{question.views} views</span>
                      <span>{question.answers?.length || 0} answers</span>
                      <span>Created: {new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Answers Preview */}
                    {question.answers && question.answers.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {question.answers.slice(0, 2).map((answer) => (
                          <div
                            key={answer.id}
                            className={`p-3 rounded-lg text-sm ${
                              answer.isAccepted 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">
                                {answer.user.name}
                              </span>
                              {answer.isAccepted && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Accepted
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 line-clamp-2">
                              {answer.content}
                            </p>
                          </div>
                        ))}
                        {question.answers.length > 2 && (
                          <p className="text-sm text-gray-500">
                            +{question.answers.length - 2} more answers
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300"
                    onClick={() => router.push(`/admin/questions/${question.id}/answers/create`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300"
                    onClick={() => router.push(`/admin/questions/${question.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-300 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteQuestion(question.id)}
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