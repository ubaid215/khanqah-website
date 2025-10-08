// src/app/api/books/[id]/download/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// POST /api/books/[id]/download - Track book download
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    // Check if book exists first
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
      select: { fileUrl: true }
    });

    if (!existingBook) {
      return errorResponse("Book not found", 404);
    }

    if (!existingBook.fileUrl) {
      return errorResponse("Book file not available", 404);
    }

    // Increment download count
    const book = await prisma.book.update({
      where: { id: params.id },
      data: {
        downloads: { increment: 1 },
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        downloads: true,
      },
    });

    return successResponse({
      message: "Download tracked",
      downloadUrl: book.fileUrl,
      downloads: book.downloads,
    });
  } catch (error) {
    console.error("Track download error:", error);
    return errorResponse("Failed to track download", 500);
  }
}