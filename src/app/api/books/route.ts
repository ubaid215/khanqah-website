// src/app/api/books/route.ts
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
import { bookSchema } from "@/lib/validations";
import { z } from "zod";
import { UserRole, BookStatus } from "@prisma/client";

// GET /api/books - List all books (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take, page } = getPaginationParams(searchParams);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "PUBLISHED";

    // FIX: Use proper type for where clause
    const where: any = {
      status: status as BookStatus,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take,
        include: {
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
      prisma.book.count({ where }),
    ]);

    return successResponse(createPaginationResponse(books, total, page, take));
  } catch (error) {
    console.error("Get books error:", error);
    return errorResponse("Failed to fetch books", 500);
  }
}

// POST /api/books - Create new book (admin only)
export async function POST(request: NextRequest) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = bookSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;

    // Auto-generate slug if not provided
    if (!validatedData.slug) {
      validatedData.slug = generateSlug(validatedData.title);
    }

    const book = await prisma.book.create({
      data: {
        ...validatedData,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return successResponse(book, 201);
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Create book error:", error);
    return errorResponse("Failed to create book", 500);
  }
}