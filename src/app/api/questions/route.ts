// src/app/api/qa/questions/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  successResponse,
  errorResponse,
  requireAuth,
  getPaginationParams,
  createPaginationResponse,
} from "@/lib/utils";
import { questionSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/qa/questions - List all questions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { skip, take, page } = getPaginationParams(searchParams);

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true,
            },
          },
          _count: {
            select: {
              answers: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.question.count({ where }),
    ]);

    return successResponse(createPaginationResponse(questions, total, page, take));
  } catch (error) {
    console.error("Get questions error:", error);
    return errorResponse("Failed to fetch questions", 500);
  }
}

// POST /api/qa/questions - Create new question
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const validatedData = questionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        ...validatedData,
        userId: auth.user.id,
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    return successResponse(question, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation error", 400, error.errors);
    }
    console.error("Create question error:", error);
    return errorResponse("Failed to create question", 500);
  }
}

