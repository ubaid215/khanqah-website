// src/app/api/lessons/[id]/complete/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// POST /api/lessons/[id]/complete - Mark lesson as completed
export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const userId = auth.user.id;
    const lessonId = params.id;

    // Get lesson with course info
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          select: {
            courseId: true,
          },
        },
      },
    });

    if (!lesson) {
      return errorResponse("Lesson not found", 404);
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: lesson.module.courseId,
        },
      },
    });

    if (!enrollment) {
      return errorResponse("Not enrolled in this course", 403);
    }

    // Mark as completed
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        watchedDuration: lesson.duration || 0,
      },
      create: {
        userId,
        lessonId,
        isCompleted: true,
        completedAt: new Date(),
        watchedDuration: lesson.duration || 0,
      },
    });

    // Update course progress
    await updateCourseProgress(userId, lesson.module.courseId);

    return successResponse({
      ...progress,
      message: "Lesson marked as completed",
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return errorResponse("Failed to mark lesson as completed", 500);
  }
}