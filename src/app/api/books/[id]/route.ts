// src/app/api/books/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { UserRole, BookStatus } from "@prisma/client";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/books/[id] - Get single book
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    if (!book) {
      return errorResponse("Book not found", 404);
    }

    return successResponse(book);
  } catch (error) {
    console.error("Get book error:", error);
    return errorResponse("Failed to fetch book", 500);
  }
}

// PUT /api/books/[id] - Update book (admin only)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    // FIX: Get current book first to avoid circular reference
    const currentBook = await prisma.book.findUnique({
      where: { id: params.id },
      select: { publishedAt: true }
    });

    if (!currentBook) {
      return errorResponse("Book not found", 404);
    }

    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...body,
        // FIX: Use currentBook instead of book to avoid circular reference
        publishedAt: body.status === "PUBLISHED" && !currentBook.publishedAt
          ? new Date()
          : undefined,
      },
    });

    return successResponse(book);
  } catch (error) {
    console.error("Update book error:", error);
    return errorResponse("Failed to update book", 500);
  }
}

// DELETE /api/books/[id] - Delete book (admin only)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    await prisma.book.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    return errorResponse("Failed to delete book", 500);
  }
}