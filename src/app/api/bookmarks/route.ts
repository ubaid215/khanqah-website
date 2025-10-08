
// src/app/api/bookmarks/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

// GET /api/bookmarks - Get user bookmarks
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // article, book, course

    const where: any = { userId: auth.user.id };
    if (type) where.type = type.toUpperCase();

    const bookmarks = await prisma.bookmark.findMany({
      where,
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            thumbnail: true,
            readTime: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            slug: true,
            author: true,
            coverImage: true,
            pages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(bookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    return errorResponse("Failed to fetch bookmarks", 500);
  }
}

// POST /api/bookmarks - Add bookmark
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { type, articleId, bookId, courseId } = body;

    if (!type) {
      return errorResponse("Bookmark type is required", 400);
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findFirst({
      where: {
        userId: auth.user.id,
        type: type.toUpperCase(),
        ...(articleId && { articleId }),
        ...(bookId && { bookId }),
        ...(courseId && { courseId }),
      },
    });

    if (existing) {
      return errorResponse("Already bookmarked", 400);
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: auth.user.id,
        type: type.toUpperCase(),
        ...(articleId && { articleId }),
        ...(bookId && { bookId }),
        ...(courseId && { courseId }),
      },
    });

    return successResponse(bookmark, 201);
  } catch (error) {
    console.error("Create bookmark error:", error);
    return errorResponse("Failed to create bookmark", 500);
  }
}

// DELETE /api/bookmarks - Remove bookmark
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const bookmarkId = searchParams.get("id");

    if (!bookmarkId) {
      return errorResponse("Bookmark ID is required", 400);
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: { id: bookmarkId },
    });

    if (!bookmark) {
      return errorResponse("Bookmark not found", 404);
    }

    if (bookmark.userId !== auth.user.id) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.bookmark.delete({
      where: { id: bookmarkId },
    });

    return successResponse({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return errorResponse("Failed to delete bookmark", 500);
  }
}