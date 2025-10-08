// src/app/api/articles/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { UserRole } from "@prisma/client";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/articles/[id] - Get single article
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    if (!article) {
      return errorResponse("Article not found", 404);
    }

    // Increment views
    await prisma.article.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return successResponse(article);
  } catch (error) {
    console.error("Get article error:", error);
    return errorResponse("Failed to fetch article", 500);
  }
}

// PUT /api/articles/[id] - Update article (admin only)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    // FIX: Use only ADMIN for now since SUPER_ADMIN might not be generated
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { tagIds, ...updateData } = body;

    // Get current article first to avoid circular reference
    const currentArticle = await prisma.article.findUnique({
      where: { id: params.id },
      select: { publishedAt: true }
    });

    if (!currentArticle) {
      return errorResponse("Article not found", 404);
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...updateData,
        // Use currentArticle instead of article to avoid circular reference
        publishedAt: updateData.status === "PUBLISHED" && !currentArticle.publishedAt
          ? new Date()
          : undefined,
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId: string) => ({
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

    return successResponse(article);
  } catch (error) {
    console.error("Update article error:", error);
    return errorResponse("Failed to update article", 500);
  }
}

// DELETE /api/articles/[id] - Delete article (admin only)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // FIX: Use only ADMIN for now since SUPER_ADMIN might not be generated
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    await prisma.article.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Delete article error:", error);
    return errorResponse("Failed to delete article", 500);
  }
}