// src/app/api/courses/[id]/enroll/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// POST /api/courses/[id]/enroll - Enroll in course
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const userId = auth.user.id;
    const courseId = params.id;

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return errorResponse("Course not found", 404);
    }

    if (!course.isPublished) {
      return errorResponse("Course is not available for enrollment", 400);
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return errorResponse("Already enrolled in this course", 400);
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
          },
        },
      },
    });

    return successResponse(enrollment, 201);
  } catch (error) {
    console.error("Enrollment error:", error);
    return errorResponse("Failed to enroll in course", 500);
  }
}