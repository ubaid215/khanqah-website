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

export type QuestionWithRelations = Question & {
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
    views: number
  }
}

export class QuestionModel {
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

  // Answer methods
  static async createAnswer(data: CreateAnswerData): Promise<Answer> {
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

  static async acceptAnswer(answerId: string): Promise<Answer> {
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

  static async deleteAnswer(id: string): Promise<Answer> {
    return await prisma.answer.delete({
      where: { id }
    })
  }
}