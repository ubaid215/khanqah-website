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
    return await prisma.bookmark.delete({
      where: {
        userId_type_articleId_bookId_courseId: {
          userId: data.userId,
          type: data.type,
          articleId: data.articleId || null,
          bookId: data.bookId || null,
          courseId: data.courseId || null
        }
      }
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
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_type_articleId_bookId_courseId: {
          userId: data.userId,
          type: data.type,
          articleId: data.articleId || null,
          bookId: data.bookId || null,
          courseId: data.courseId || null
        }
      }
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