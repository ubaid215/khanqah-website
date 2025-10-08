// src/app/api/courses/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { 
  successResponse, 
  errorResponse, 
  requireAuth, 
  getPaginationParams,
  createPaginationResponse,
  buildSearchQuery 
} from "@/lib/utils";
import { courseSchema } from "@/lib/validations";
import { z } from "zod";
import { UserRole, CourseStatus, CourseLevel } from "@prisma/client";

// GET /api/courses - List all courses (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take, page } = getPaginationParams(searchParams);
    
    const search = searchParams.get("search") || "";
    const level = searchParams.get("level");
    const categoryId = searchParams.get("categoryId");
    const isFree = searchParams.get("isFree");

    // Build where clause
    const where: any = {
      isPublished: true,
      status: CourseStatus.PUBLISHED,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (level) where.level = level as CourseLevel;
    if (isFree !== null) where.isFree = isFree === "true";
    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    }

    // Fetch courses with count
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take,
        include: {
          categories: {
            include: {
              category: {
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
              enrollments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.course.count({ where }),
    ]);

    return successResponse(
      createPaginationResponse(courses, total, page, take)
    );
  } catch (error) {
    console.error("Get courses error:", error);
    return errorResponse("Failed to fetch courses", 500);
  }
}

// POST /api/courses - Create new course (admin only)
export async function POST(request: NextRequest) {
  try {
    // FIX: Use proper UserRole enum values instead of string literals
    const auth = await requireAuth([UserRole.ADMIN]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = courseSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;
    const { categoryIds, ...courseData } = validatedData;

    // Create course with categories
    const course = await prisma.course.create({
      data: {
        ...courseData,
        categories: {
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return successResponse(course, 201);
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Create course error:", error);
    return errorResponse("Failed to create course", 500);
  }
}