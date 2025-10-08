// src/app/api/tags/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { UserRole } from "@prisma/client";

// GET /api/tags - Get all tags
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return successResponse(tags);
  } catch (error) {
    console.error("Get tags error:", error);
    return errorResponse("Failed to fetch tags", 500);
  }
}

// POST /api/tags - Create tag (admin only)
export async function POST(request: NextRequest) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return errorResponse("Name and slug are required", 400);
    }

    // Check if tag with same name or slug already exists
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existingTag) {
      return errorResponse("Tag with this name or slug already exists", 400);
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return successResponse(tag, 201);
  } catch (error) {
    console.error("Create tag error:", error);
    return errorResponse("Failed to create tag", 500);
  }
}