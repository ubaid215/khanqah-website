// src/app/api/courses/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { UserRole } from "@prisma/client";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/courses/[id] - Get single course
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return errorResponse("Course not found", 404);
    }

    return successResponse(course);
  } catch (error) {
    console.error("Get course error:", error);
    return errorResponse("Failed to fetch course", 500);
  }
}

// PUT /api/courses/[id] - Update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const { categoryIds, ...updateData } = body;

    // Update course
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(categoryIds && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId: string) => ({
              categoryId,
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return successResponse(course);
  } catch (error) {
    console.error("Update course error:", error);
    return errorResponse("Failed to update course", 500);
  }
}

// DELETE /api/courses/[id] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    await prisma.course.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    return errorResponse("Failed to delete course", 500);
  }
}