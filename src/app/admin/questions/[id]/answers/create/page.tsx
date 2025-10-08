// src/app/admin/questions/[id]/answers/create/page.tsx
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { 
  ArrowLeft,
  Save,
  Loader2,
  HelpCircle
} from 'lucide-react'

export default function CreateAnswerPage() {
  const router = useRouter()
  const params = useParams()
  const questionId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [content, setContent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.createAnswer(questionId, { content })
      if (response.success) {
        router.push(`/admin/questions/${questionId}/edit`)
      }
    } catch (error: any) {
      console.error('Failed to create answer:', error)
      alert(error.message || 'Failed to create answer')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Post an Answer</h1>
          <p className="text-gray-600 mt-1">
            Help the community by providing a helpful answer
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Your Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your answer here. Be detailed and provide examples if possible."
                  rows={12}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Provide a clear and comprehensive answer to help the question author
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Answer */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  How to Answer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">Writing a good answer</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Answer the question clearly and concisely</li>
                    <li>Provide examples and code if relevant</li>
                    <li>Explain why your solution works</li>
                    <li>Be kind and professional</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Post Answer
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.back()}
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