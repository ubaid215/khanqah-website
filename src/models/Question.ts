// src/models/Question.ts
import { prisma } from '@/lib/prisma'
import { Question, QuestionStatus, Answer, Prisma } from '@prisma/client'

export interface CreateQuestionData {
  userId: string
  title: string
  content: string
}

export interface CreateAnswerData {
  questionId: string
  userId: string
  content: string
}

// Fix: Update the type to match Prisma schema (nullable fields)
export type QuestionWithRelations = Question & {
  user: {
    id: string
    name: string | null
    image: string | null
    username: string | null
  }
  answers: (Answer & {
    user: {
      id: string
      name: string | null
      image: string | null
      username: string | null
    }
  })[]
  _count?: {
    answers: number
  }
}

// Optional: Create a safe version with default values
export type SafeQuestionWithRelations = Question & {
  user: {
    id: string
    name: string
    image: string
    username: string
  }
  answers: (Answer & {
    user: {
      id: string
      name: string
      image: string
      username: string
    }
  })[]
  _count?: {
    answers: number
  }
}

export class QuestionModel {
  // Helper method to handle null values safely
  private static safeUser(user: { id: string; name: string | null; image: string | null; username: string | null }) {
    return {
      id: user.id,
      name: user.name || 'Anonymous',
      image: user.image || '/images/avatar-placeholder.png',
      username: user.username || 'user'
    }
  }

  private static makeQuestionSafe(question: QuestionWithRelations): SafeQuestionWithRelations {
    return {
      ...question,
      user: this.safeUser(question.user),
      answers: question.answers.map(answer => ({
        ...answer,
        user: this.safeUser(answer.user)
      }))
    }
  }

  // Question methods
  static async create(data: CreateQuestionData): Promise<QuestionWithRelations> {
    return await prisma.question.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    })
  }

  // Safe version with default values
  static async createSafe(data: CreateQuestionData): Promise<SafeQuestionWithRelations> {
    const question = await this.create(data)
    return this.makeQuestionSafe(question)
  }

  static async findById(id: string): Promise<QuestionWithRelations | null> {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    })
  }

  // Safe version with default values
  static async findByIdSafe(id: string): Promise<SafeQuestionWithRelations | null> {
    const question = await this.findById(id)
    return question ? this.makeQuestionSafe(question) : null
  }

  static async updateQuestion(id: string, data: {
    title?: string
    content?: string
    status?: QuestionStatus
  }): Promise<QuestionWithRelations> {
    return await prisma.question.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        answers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                username: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: {
            answers: true
          }
        }
      }
    })
  }

  // Safe version with default values
  static async updateQuestionSafe(id: string, data: {
    title?: string
    content?: string
    status?: QuestionStatus
  }): Promise<SafeQuestionWithRelations> {
    const question = await this.updateQuestion(id, data)
    return this.makeQuestionSafe(question)
  }

  static async deleteQuestion(id: string): Promise<Question> {
    return await prisma.question.delete({
      where: { id }
    })
  }

  static async incrementViews(id: string): Promise<void> {
    await prisma.question.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    })
  }

  static async getQuestions(options?: {
    status?: QuestionStatus
    userId?: string
    page?: number
    limit?: number
  }) {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.QuestionWhereInput = {
      ...(options?.status && { status: options.status }),
      ...(options?.userId && { userId: options.userId })
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true
            }
          },
          _count: {
            select: {
              answers: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.question.count({ where })
    ])

    return {
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Safe version for getQuestions
  static async getQuestionsSafe(options?: {
    status?: QuestionStatus
    userId?: string
    page?: number
    limit?: number
  }) {
    const result = await this.getQuestions(options)
    
    const safeQuestions = result.questions.map(question => ({
      ...question,
      user: this.safeUser(question.user)
    }))

    return {
      questions: safeQuestions,
      pagination: result.pagination
    }
  }

  // Answer methods
  static async createAnswer(data: CreateAnswerData): Promise<Answer & {
    user: {
      id: string
      name: string | null
      image: string | null
      username: string | null
    }
    question: Question
  }> {
    return await prisma.answer.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        },
        question: true
      }
    })
  }

  // Safe version for createAnswer
  static async createAnswerSafe(data: CreateAnswerData): Promise<Answer & {
    user: {
      id: string
      name: string
      image: string
      username: string
    }
    question: Question
  }> {
    const answer = await this.createAnswer(data)
    return {
      ...answer,
      user: this.safeUser(answer.user)
    }
  }

  static async acceptAnswer(answerId: string): Promise<Answer & {
    user: {
      id: string
      name: string | null
      image: string | null
      username: string | null
    }
  }> {
    const answer = await prisma.answer.findUnique({
      where: { id: answerId },
      include: { question: true }
    })

    if (!answer) {
      throw new Error('Answer not found')
    }

    // Unaccept any previously accepted answers for this question
    await prisma.answer.updateMany({
      where: {
        questionId: answer.questionId,
        isAccepted: true
      },
      data: { isAccepted: false }
    })

    // Accept the new answer
    return await prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true
          }
        }
      }
    })
  }

  // Safe version for acceptAnswer
  static async acceptAnswerSafe(answerId: string): Promise<Answer & {
    user: {
      id: string
      name: string
      image: string
      username: string
    }
  }> {
    const answer = await this.acceptAnswer(answerId)
    return {
      ...answer,
      user: this.safeUser(answer.user)
    }
  }

  static async deleteAnswer(id: string): Promise<Answer> {
    return await prisma.answer.delete({
      where: { id }
    })
  }
}