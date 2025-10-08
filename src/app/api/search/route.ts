
// src/app/api/search/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/utils";

// GET /api/search - Global search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return errorResponse("Search query must be at least 2 characters", 400);
    }

    const searchCondition = {
      contains: query,
      mode: "insensitive" as const,
    };

    // Search across courses, articles, books, and questions
    const [courses, articles, books, questions] = await Promise.all([
      prisma.course.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: searchCondition },
            { description: searchCondition },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          level: true,
        },
      }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          OR: [{ title: searchCondition }, { excerpt: searchCondition }],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          readTime: true,
        },
      }),
      prisma.book.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: searchCondition },
            { author: searchCondition },
            { description: searchCondition },
          ],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          coverImage: true,
        },
      }),
      prisma.question.findMany({
        where: {
          OR: [{ title: searchCondition }, { content: searchCondition }],
        },
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          views: true,
        },
      }),
    ]);

    return successResponse({
      query,
      results: {
        courses,
        articles,
        books,
        questions,
      },
      total:
        courses.length +
        articles.length +
        books.length +
        questions.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return errorResponse("Search failed", 500);
  }
}