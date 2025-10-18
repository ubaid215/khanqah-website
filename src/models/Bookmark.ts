// src/models/Bookmark.ts
import { prisma } from '@/lib/prisma'
import { Bookmark, BookmarkType } from '@prisma/client'

export interface CreateBookmarkData {
  userId: string
  type: BookmarkType
  articleId?: string
  bookId?: string
  courseId?: string
}

export class BookmarkModel {
  static async create(data: CreateBookmarkData): Promise<Bookmark> {
    // Validate that only one resource ID is provided
    const resourceIds = [data.articleId, data.bookId, data.courseId].filter(Boolean)
    if (resourceIds.length !== 1) {
      throw new Error('Exactly one resource ID must be provided')
    }

    return await prisma.bookmark.create({
      data,
      include: {
        article: {
          include: {
            tags: {
              include: { tag: true }
            }
          }
        },
        book: true
      }
    })
  }

  static async delete(bookmarkId: string): Promise<Bookmark> {
    return await prisma.bookmark.delete({
      where: { id: bookmarkId }
    })
  }

  static async deleteByResource(data: {
    userId: string
    type: BookmarkType
    articleId?: string
    bookId?: string
    courseId?: string
  }): Promise<Bookmark> {
    // Build the where condition based on the provided resource ID
    let whereCondition: any = {
      userId: data.userId,
      type: data.type
    }

    // Set the appropriate resource ID based on type
    if (data.articleId) {
      whereCondition.articleId = data.articleId
    } else if (data.bookId) {
      whereCondition.bookId = data.bookId
    } else if (data.courseId) {
      whereCondition.courseId = data.courseId
    } else {
      throw new Error('At least one resource ID must be provided')
    }

    return await prisma.bookmark.delete({
      where: whereCondition
    })
  }

  static async getUserBookmarks(userId: string, type?: BookmarkType) {
    const where: any = { userId }
    if (type) {
      where.type = type
    }

    return await prisma.bookmark.findMany({
      where,
      include: {
        article: {
          include: {
            tags: {
              include: { tag: true }
            }
          }
        },
        book: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  static async isBookmarked(data: {
    userId: string
    type: BookmarkType
    articleId?: string
    bookId?: string
    courseId?: string
  }): Promise<boolean> {
    // Build the where condition based on the provided resource ID
    let whereCondition: any = {
      userId: data.userId,
      type: data.type
    }

    // Set the appropriate resource ID based on type
    if (data.articleId) {
      whereCondition.articleId = data.articleId
    } else if (data.bookId) {
      whereCondition.bookId = data.bookId
    } else if (data.courseId) {
      whereCondition.courseId = data.courseId
    } else {
      throw new Error('At least one resource ID must be provided')
    }

    const bookmark = await prisma.bookmark.findFirst({
      where: whereCondition
    })

    return !!bookmark
  }

  static async getBookmarkCount(resource: {
    articleId?: string
    bookId?: string
    courseId?: string
  }): Promise<number> {
    const where: any = {}
    
    if (resource.articleId) where.articleId = resource.articleId
    if (resource.bookId) where.bookId = resource.bookId
    if (resource.courseId) where.courseId = resource.courseId

    return await prisma.bookmark.count({ where })
  }
}