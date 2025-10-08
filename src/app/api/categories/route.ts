// src/app/api/categories/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { UserRole } from "@prisma/client";

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return successResponse(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { name, slug, description, icon } = body;

    if (!name || !slug) {
      return errorResponse("Name and slug are required", 400);
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existingCategory) {
      return errorResponse("Category with this name or slug already exists", 400);
    }

    const category = await prisma.category.create({
      data: { name, slug, description, icon },
    });

    return successResponse(category, 201);
  } catch (error) {
    console.error("Create category error:", error);
    return errorResponse("Failed to create category", 500);
  }
}