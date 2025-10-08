// src/models/Book.ts
import { prisma } from '@/lib/prisma'
import { Book, BookStatus, Prisma } from '@prisma/client'

export interface CreateBookData {
  title: string
  slug: string
  description: string
  author: string
  coverImage?: string
  fileUrl?: string
  pages?: number
}

export interface UpdateBookData {
  title?: string
  description?: string
  author?: string
  coverImage?: string
  fileUrl?: string
  pages?: number
  status?: BookStatus
  publishedAt?: Date | null
}

export type BookWithRelations = Book & {
  _count?: {
    bookmarks: number
  }
}

export class BookModel {
  static async create(data: CreateBookData): Promise<BookWithRelations> {
    return await prisma.book.create({
      data,
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findById(id: string): Promise<BookWithRelations | null> {
    return await prisma.book.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findPublishedBookById(id: string): Promise<BookWithRelations | null> {
    return await prisma.book.findFirst({
      where: { 
        id,
        status: BookStatus.PUBLISHED 
      },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findBySlug(slug: string): Promise<BookWithRelations | null> {
    return await prisma.book.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findPublishedBookBySlug(slug: string): Promise<BookWithRelations | null> {
    return await prisma.book.findFirst({
      where: { 
        slug,
        status: BookStatus.PUBLISHED 
      },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async updateBook(id: string, data: UpdateBookData): Promise<BookWithRelations> {
    return await prisma.book.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === BookStatus.PUBLISHED ? new Date() : data.publishedAt
      },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async publishBook(id: string): Promise<BookWithRelations> {
    return await prisma.book.update({
      where: { id },
      data: {
        status: BookStatus.PUBLISHED,
        publishedAt: new Date()
      },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async unpublishBook(id: string): Promise<BookWithRelations> {
    return await prisma.book.update({
      where: { id },
      data: {
        status: BookStatus.DRAFT,
        publishedAt: null
      },
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async deleteBook(id: string): Promise<Book> {
    return await prisma.book.delete({
      where: { id }
    })
  }

  static async incrementDownloads(id: string): Promise<void> {
    await prisma.book.update({
      where: { id },
      data: {
        downloads: { increment: 1 }
      }
    })
  }

  static async getPublishedBooks(options?: {
    page?: number
    limit?: number
    search?: string
    author?: string
  }) {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.BookWhereInput = {
      status: BookStatus.PUBLISHED,
      ...(options?.search && {
        OR: [
          { title: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } },
          { author: { contains: options.search, mode: 'insensitive' } }
        ]
      }),
      ...(options?.author && {
        author: { contains: options.author, mode: 'insensitive' }
      })
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          _count: {
            select: {
              bookmarks: true
            }
          }
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.book.count({ where })
    ])

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getAdminBooks(options?: {
    page?: number
    limit?: number
    status?: BookStatus
    search?: string
  }) {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.BookWhereInput = {
      ...(options?.status && { status: options.status }),
      ...(options?.search && {
        OR: [
          { title: { contains: options.search, mode: 'insensitive' } },
          { description: { contains: options.search, mode: 'insensitive' } },
          { author: { contains: options.search, mode: 'insensitive' } }
        ]
      })
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          _count: {
            select: {
              bookmarks: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.book.count({ where })
    ])

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  static async getPopularBooks(limit: number = 10) {
    return await prisma.book.findMany({
      where: {
        status: BookStatus.PUBLISHED
      },
      orderBy: [
        { downloads: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit,
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async getRecentBooks(limit: number = 10) {
    return await prisma.book.findMany({
      where: {
        status: BookStatus.PUBLISHED
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async getBooksByAuthor(author: string, limit: number = 10) {
    return await prisma.book.findMany({
      where: {
        status: BookStatus.PUBLISHED,
        author: {
          contains: author,
          mode: 'insensitive'
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit,
      include: {
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async getBookStats() {
    const [totalBooks, publishedBooks, totalDownloads, popularBooks] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: BookStatus.PUBLISHED } }),
      prisma.book.aggregate({
        _sum: {
          downloads: true
        }
      }),
      this.getPopularBooks(5)
    ])

    return {
      totalBooks,
      publishedBooks,
      draftBooks: totalBooks - publishedBooks,
      totalDownloads: totalDownloads._sum.downloads || 0,
      popularBooks
    }
  }

  static async searchBooks(query: string, options?: {
    page?: number
    limit?: number
  }) {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.BookWhereInput = {
      status: BookStatus.PUBLISHED,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } }
      ]
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          _count: {
            select: {
              bookmarks: true
            }
          }
        },
        orderBy: {
          _relevance: {
            fields: ['title', 'author', 'description'],
            search: query,
            sort: 'desc'
          }
        },
        skip,
        take: limit
      }),
      prisma.book.count({ where })
    ])

    return {
      books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}