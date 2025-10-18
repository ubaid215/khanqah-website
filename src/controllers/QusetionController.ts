// src/controllers/QuestionController.ts
import { NextRequest, NextResponse } from 'next/server'
import { QuestionModel } from '@/models/Question'
import { AuthMiddleware, ApiResponse } from './AuthController'
import { QuestionStatus } from '@prisma/client'

export class QuestionController {
  static async createQuestion(req: NextRequest) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { title, content } = await req.json()

      // Validation
      const validationErrors: Record<string, string> = {}
      
      if (!title) validationErrors.title = 'Title is required'
      if (!content) validationErrors.content = 'Content is required'
      
      if (title && title.length < 10) {
        validationErrors.title = 'Title must be at least 10 characters'
      }

      if (content && content.length < 20) {
        validationErrors.content = 'Content must be at least 20 characters'
      }

      if (Object.keys(validationErrors).length > 0) {
        return ApiResponse.validationError(validationErrors)
      }

      const question = await QuestionModel.create({
        userId: authResult.user!.id,
        title,
        content
      })

      return ApiResponse.success(
        question,
        'Question created successfully',
        201
      )
    } catch (error) {
      console.error('Create question error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getQuestion(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const question = await QuestionModel.findById(params.id)
      if (!question) {
        return ApiResponse.error('Question not found', 404)
      }

      // Increment views
      await QuestionModel.incrementViews(params.id)

      return ApiResponse.success(question, 'Question retrieved successfully')
    } catch (error) {
      console.error('Get question error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async updateQuestion(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const question = await QuestionModel.findById(params.id)
      if (!question) {
        return ApiResponse.error('Question not found', 404)
      }

      // Only question owner can update
      if (question.user.id !== authResult.user!.id) {
        return ApiResponse.error('Not authorized to update this question', 403)
      }

      const data = await req.json()
      const updatedQuestion = await QuestionModel.updateQuestion(params.id, data)

      return ApiResponse.success(updatedQuestion, 'Question updated successfully')
    } catch (error) {
      console.error('Update question error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteQuestion(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const question = await QuestionModel.findById(params.id)
      if (!question) {
        return ApiResponse.error('Question not found', 404)
      }

      // Only question owner can delete
      if (question.user.id !== authResult.user!.id) {
        return ApiResponse.error('Not authorized to delete this question', 403)
      }

      await QuestionModel.deleteQuestion(params.id)

      return ApiResponse.success(null, 'Question deleted successfully')
    } catch (error) {
      console.error('Delete question error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async getQuestions(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url)
      const statusParam = searchParams.get('status')
      const userIdParam = searchParams.get('userId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '10')

      // Convert null to undefined to match the expected types
      const status = statusParam as QuestionStatus | undefined
      const userId = userIdParam || undefined

      const result = await QuestionModel.getQuestions({
        status,
        userId,
        page,
        limit
      })

      return ApiResponse.success(result, 'Questions retrieved successfully')
    } catch (error) {
      console.error('Get questions error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async createAnswer(req: NextRequest, { params }: { params: { questionId: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const { content } = await req.json()

      if (!content) {
        return ApiResponse.error('Content is required', 400)
      }

      if (content.length < 10) {
        return ApiResponse.error('Answer must be at least 10 characters', 400)
      }

      const answer = await QuestionModel.createAnswer({
        questionId: params.questionId,
        userId: authResult.user!.id,
        content
      })

      return ApiResponse.success(
        answer,
        'Answer created successfully',
        201
      )
    } catch (error) {
      console.error('Create answer error:', error)
      return ApiResponse.error('Internal server error')
    }
  }

  static async acceptAnswer(req: NextRequest, { params }: { params: { answerId: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const answer = await QuestionModel.acceptAnswer(params.answerId)

      // Check if the current user is the question owner
      const question = await QuestionModel.findById(answer.questionId)
      if (!question) {
        return ApiResponse.error('Question not found', 404)
      }

      if (question.user.id !== authResult.user!.id) {
        return ApiResponse.error('Only question owner can accept answers', 403)
      }

      return ApiResponse.success(answer, 'Answer accepted successfully')
    } catch (error: any) {
      console.error('Accept answer error:', error)
      
      if (error.message.includes('Answer not found')) {
        return ApiResponse.error('Answer not found', 404)
      }
      
      return ApiResponse.error('Internal server error')
    }
  }

  static async deleteAnswer(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const authResult = await AuthMiddleware.verifyAuth(req)
      if (authResult.error) {
        return ApiResponse.error(authResult.error, 401)
      }

      const answer = await QuestionModel.deleteAnswer(params.id)

      // Only answer owner can delete
      if (answer.userId !== authResult.user!.id) {
        return ApiResponse.error('Not authorized to delete this answer', 403)
      }

      return ApiResponse.success(null, 'Answer deleted successfully')
    } catch (error) {
      console.error('Delete answer error:', error)
      return ApiResponse.error('Internal server error')
    }
  }
}