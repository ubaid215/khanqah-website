// src/models/Article.ts
import { prisma } from '@/lib/prisma'
import { Article, ArticleStatus, Tag, Bookmark, Prisma } from '@prisma/client'

export interface CreateArticleData {
  title: string
  slug: string
  content: string
  excerpt?: string
  thumbnail?: string
  tagNames?: string[]
  readTime?: number
}

export interface UpdateArticleData {
  title?: string
  content?: string
  excerpt?: string
  thumbnail?: string
  status?: ArticleStatus
  readTime?: number
  publishedAt?: Date | null
}

export type ArticleWithRelations = Article & {
  tags: { tag: Tag }[]
  _count?: {
    bookmarks: number
  }
}

export class ArticleModel {
  static async create(data: CreateArticleData): Promise<ArticleWithRelations> {
    const { tagNames, ...articleData } = data
    
    return await prisma.article.create({
      data: {
        ...articleData,
        tags: tagNames ? {
          create: tagNames.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { 
                  name: tagName,
                  slug: tagName.toLowerCase().replace(/ /g, '-')
                }
              }
            }
          }))
        } : undefined
      },
      include: {
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findById(id: string): Promise<ArticleWithRelations | null> {
    return await prisma.article.findUnique({
      where: { id },
      include: {
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async findBySlug(slug: string): Promise<ArticleWithRelations | null> {
    return await prisma.article.findUnique({
      where: { slug },
      include: {
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async updateArticle(id: string, data: UpdateArticleData): Promise<ArticleWithRelations> {
    return await prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === ArticleStatus.PUBLISHED ? new Date() : data.publishedAt
      },
      include: {
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async publishArticle(id: string): Promise<ArticleWithRelations> {
    return await prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date()
      },
      include: {
        tags: {
          include: { tag: true }
        },
        _count: {
          select: {
            bookmarks: true
          }
        }
      }
    })
  }

  static async deleteArticle(id: string): Promise<Article> {
    return await prisma.article.delete({
      where: { id }
    })
  }

  static async incrementViews(id: string): Promise<void> {
    await prisma.article.update({
      where: { id },
      data: {
        views: { increment: 1 }
      }
    })
  }

  static async getPublishedArticles(options?: {
    tagSlug?: string
    page?: number
    limit?: number
  }) {
    const page = options?.page || 1
    const limit = options?.limit || 10
    const skip = (page - 1) * limit

    const where: Prisma.ArticleWhereInput = {
      status: ArticleStatus.PUBLISHED,
      ...(options?.tagSlug && {
        tags: {
          some: {
            tag: {
              slug: options.tagSlug
            }
          }
        }
      })
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          tags: {
            include: { tag: true }
          },
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
      prisma.article.count({ where })
    ])

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Tag methods
  static async getAllTags(): Promise<Tag[]> {
    return await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    })
  }

  static async getPopularTags(limit: number = 10) {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                article: {
                  status: ArticleStatus.PUBLISHED
                }
              }
            }
          }
        }
      },
      orderBy: {
        articles: {
          _count: 'desc'
        }
      },
      take: limit
    })
  }
}