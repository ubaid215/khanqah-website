// src/app/api/progress/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth, calculateCourseProgress } from "@/lib/utils";
import { progressUpdateSchema } from "@/lib/validations";
import { z } from "zod";
import { EnrollmentStatus } from "@prisma/client";

// POST /api/progress - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = progressUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;
    const userId = auth.user.id;
    const { lessonId, watchedDuration, lastPosition, isCompleted } = validatedData;

    // Check if lesson exists
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

    // Check if user is enrolled in the course
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

    // Update or create progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        watchedDuration,
        lastPosition,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        watchedDuration,
        lastPosition,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // If lesson completed, update course progress
    if (isCompleted) {
      await updateCourseProgress(userId, lesson.module.courseId);
    }

    return successResponse(progress);
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Progress update error:", error);
    return errorResponse("Failed to update progress", 500);
  }
}

// GET /api/progress?courseId=xxx - Get course progress
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return errorResponse("Course ID is required", 400);
    }

    const userId = auth.user.id;

    // Get all lessons in the course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return errorResponse("Course not found", 404);
    }

    // Calculate progress
    const allLessons = course.modules.flatMap(m => m.lessons);
    const completedLessons = allLessons.filter(
      l => l.progress[0]?.isCompleted
    );

    const progressData = {
      courseId,
      totalLessons: allLessons.length,
      completedLessons: completedLessons.length,
      progressPercentage: calculateCourseProgress(
        allLessons.length,
        completedLessons.length
      ),
      lessons: allLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        isCompleted: lesson.progress[0]?.isCompleted || false,
        watchedDuration: lesson.progress[0]?.watchedDuration || 0,
        lastPosition: lesson.progress[0]?.lastPosition || 0,
      })),
    };

    return successResponse(progressData);
  } catch (error) {
    console.error("Get progress error:", error);
    return errorResponse("Failed to fetch progress", 500);
  }
}

// Helper function to update course progress
async function updateCourseProgress(userId: string, courseId: string) {
  try {
    // Get total lessons count
    const totalLessons = await prisma.lesson.count({
      where: {
        module: {
          courseId,
        },
      },
    });

    // Get completed lessons count
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    // Calculate progress percentage
    const progressPercentage = calculateCourseProgress(totalLessons, completedLessons);

    // Update enrollment
    const enrollment = await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress: progressPercentage,
        // FIX: Use proper EnrollmentStatus enum value
        ...(progressPercentage === 100 && {
          status: EnrollmentStatus.COMPLETED,
          completedAt: new Date(),
        }),
      },
    });

    // If course completed, generate certificate
    if (progressPercentage === 100) {
      await generateCertificate(userId, courseId);
    }

    return enrollment;
  } catch (error) {
    console.error("Update course progress error:", error);
    throw error;
  }
}

// Helper function to generate certificate
async function generateCertificate(userId: string, courseId: string) {
  try {
    // Check if certificate already exists
    const existingCert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingCert) return existingCert;

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { title: true },
    });

    if (!course) return null;

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        userId,
        courseId,
        courseTitle: course.title,
        issueDate: new Date(),
        // pdfUrl will be generated separately by a certificate generation service
      },
    });

    return certificate;
  } catch (error) {
    console.error("Generate certificate error:", error);
    return null;
  }
}