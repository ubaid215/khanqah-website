// src/app/api/articles/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getPaginationParams,
  createPaginationResponse,
  generateSlug,
} from "@/lib/utils";
import { articleSchema } from "@/lib/validations";
import { z } from "zod";
import { UserRole, ArticleStatus } from "@prisma/client";

// GET /api/articles - List all articles (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take, page } = getPaginationParams(searchParams);

    const search = searchParams.get("search") || "";
    const tagId = searchParams.get("tagId");
    const status = searchParams.get("status") || "PUBLISHED";

    // FIX: Use proper type for where clause
    const where: any = {
      status: status as ArticleStatus,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tagId) {
      where.tags = {
        some: { tagId },
      };
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take,
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
      }),
      prisma.article.count({ where }),
    ]);

    return successResponse(createPaginationResponse(articles, total, page, take));
  } catch (error) {
    console.error("Get articles error:", error);
    return errorResponse("Failed to fetch articles", 500);
  }
}

// POST /api/articles - Create new article (admin only)
export async function POST(request: NextRequest) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = articleSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;
    const { tagIds, ...articleData } = validatedData;

    // Auto-generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = generateSlug(articleData.title);
    }

    // Create article with tags
    const article = await prisma.article.create({
      data: {
        ...articleData,
        publishedAt: articleData.status === "PUBLISHED" ? new Date() : null,
        ...(tagIds && tagIds.length > 0 && {
          tags: {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          },
        }),
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return successResponse(article, 201);
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Create article error:", error);
    return errorResponse("Failed to create article", 500);
  }
}