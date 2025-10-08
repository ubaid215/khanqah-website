// src/app/api/dashboard/stats/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const userId = auth.user.id;

    // User statistics
    if (auth.user.role === "USER") {
      const [enrollments, completedCourses, certificates, questions, answers] =
        await Promise.all([
          prisma.enrollment.count({
            where: { userId, status: "ACTIVE" },
          }),
          prisma.enrollment.count({
            where: { userId, status: "COMPLETED" },
          }),
          prisma.certificate.count({ where: { userId } }),
          prisma.question.count({ where: { userId } }),
          prisma.answer.count({ where: { userId } }),
        ]);

      // Get recent enrollments with progress
      const recentEnrollments = await prisma.enrollment.findMany({
        where: { userId },
        take: 5,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              level: true,
            },
          },
        },
        orderBy: { enrolledAt: "desc" },
      });

      return successResponse({
        enrolledCourses: enrollments,
        completedCourses,
        certificates,
        questionsAsked: questions,
        answersGiven: answers,
        recentEnrollments,
      });
    }

    // Admin statistics
    if (["ADMIN", "SUPER_ADMIN"].includes(auth.user.role)) {
      const [
        totalUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalArticles,
        totalBooks,
        totalQuestions,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.course.count({ where: { isPublished: true } }),
        prisma.enrollment.count(),
        prisma.article.count({ where: { status: "PUBLISHED" } }),
        prisma.book.count({ where: { status: "PUBLISHED" } }),
        prisma.question.count(),
      ]);

      return successResponse({
        totalUsers,
        totalCourses,
        publishedCourses,
        totalEnrollments,
        totalArticles,
        totalBooks,
        totalQuestions,
      });
    }

    return errorResponse("Invalid role", 400);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return errorResponse("Failed to fetch dashboard statistics", 500);
  }
}