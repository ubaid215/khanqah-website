// src/app/my-questions/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { 
  MessageSquare,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  ThumbsUp,
  Loader2,
  User
} from 'lucide-react'

interface Answer {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  isAccepted: boolean
  user: {
    id: string
    name: string
    image: string
    username: string
  }
  _count: {
    votes: number
  }
}

interface Question {
  id: string
  title: string
  content: string
  status: string
  views: number
  createdAt: string
  updatedAt: string
  answers: Answer[]
  _count: {
    answers: number
    votes: number
  }
}

export default function MyQuestionsPage() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', content: '' })

  useEffect(() => {
    if (user) {
      fetchMyQuestions()
    }
  }, [user])

  const fetchMyQuestions = async () => {
    try {
      const response = await apiClient.getQuestions({ userId: user?.id })
      if (response.success) {
        setQuestions(response.data?.questions || [])
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return
    
    try {
      await apiClient.deleteQuestion(questionId)
      setQuestions(questions.filter(q => q.id !== questionId))
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question')
    }
  }

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question.id)
    setEditForm({
      title: question.title,
      content: question.content
    })
  }

  const handleSaveEdit = async (questionId: string) => {
    try {
      const response = await apiClient.updateQuestion(questionId, {
        title: editForm.title,
        content: editForm.content
      })

      if (response.success) {
        setQuestions(questions.map(q => 
          q.id === questionId ? response.data : q
        ))
        setEditingQuestion(null)
      }
    } catch (error) {
      console.error('Failed to update question:', error)
      alert('Failed to update question')
    }
  }

  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setEditForm({ title: '', content: '' })
  }

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await apiClient.acceptAnswer(answerId)
      // Refresh questions to update the accepted answer status
      await fetchMyQuestions()
    } catch (error) {
      console.error('Failed to accept answer:', error)
      alert('Failed to accept answer')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ANSWERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'UNANSWERED': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ANSWERED': return <CheckCircle2 className="h-4 w-4" />
      case 'UNANSWERED': return <Clock className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Questions</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your questions and their answers
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/ask-question'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="bg-blue-50 border-blue-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
              <Input
                placeholder="Search your questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-blue-200 focus:border-blue-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">All Questions</option>
              <option value="UNANSWERED">Unanswered</option>
              <option value="ANSWERED">Answered</option>
              <option value="CLOSED">Closed</option>
            </select>
            <Button 
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-100"
              onClick={fetchMyQuestions}
            >
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-4">Start by asking your first question to get help from the community</p>
            <Button 
              onClick={() => window.location.href = '/ask-question'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ask Your First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline" className={getStatusColor(question.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(question.status)}
                          <span className="ml-1">{question.status}</span>
                        </span>
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {question.views} views
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {question._count.answers} answers
                      </div>
                    </div>
                    
                    {editingQuestion === question.id ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Question title"
                          className="text-lg font-semibold"
                        />
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Question content"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        />
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleSaveEdit(question.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={handleCancelEdit}
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {question.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{question.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                            {question.updatedAt !== question.createdAt && (
                              <span>Updated {new Date(question.updatedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditQuestion(question)}
                              className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Answers Section */}
                {question._count.answers > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <button
                      onClick={() => toggleQuestion(question.id)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h4 className="font-semibold text-gray-900">
                        Answers ({question._count.answers})
                      </h4>
                      <div className="flex items-center space-x-2">
                        {question.answers.some(answer => answer.isAccepted) && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Solved
                          </Badge>
                        )}
                      </div>
                    </button>

                    {expandedQuestions.has(question.id) && (
                      <div className="mt-4 space-y-4">
                        {question.answers.map((answer) => (
                          <div
                            key={answer.id}
                            className={`p-4 rounded-lg border ${
                              answer.isAccepted
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar 
                                  src={answer.user.image} 
                                  alt={answer.user.name}
                                  fallback={getInitials(answer.user.name)}
                                  className="h-8 w-8"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {answer.user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    @{answer.user.username}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {!answer.isAccepted && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptAnswer(answer.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                )}
                                {answer.isAccepted && (
                                  <Badge className="bg-green-100 text-green-800 border-green-200">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Accepted
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">{answer.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span>
                                  Answered {new Date(answer.createdAt).toLocaleDateString()}
                                </span>
                                <div className="flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  {answer._count.votes} votes
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {filteredQuestions.length > 0 && (
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {questions.filter(q => q.status === 'ANSWERED').length}
                </div>
                <div className="text-sm text-gray-600">Answered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {questions.filter(q => q.status === 'UNANSWERED').length}
                </div>
                <div className="text-sm text-gray-600">Unanswered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {questions.reduce((total, q) => total + q._count.answers, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Answers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}