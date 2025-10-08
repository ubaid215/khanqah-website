// src/app/api/qa/answers/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { answerSchema } from "@/lib/validations";
import { z } from "zod";

// POST /api/qa/answers - Create new answer
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse to avoid throwing errors
    const validationResult = answerSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property name 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;
    const questionId = body.questionId;

    if (!questionId) {
      return errorResponse("Question ID is required", 400);
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return errorResponse("Question not found", 404);
    }

    const answer = await prisma.answer.create({
      data: {
        content: validatedData.content,
        userId: auth.user.id,
        questionId,
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

    // Update question status to ANSWERED if it was OPEN
    if (question.status === "OPEN") {
      await prisma.question.update({
        where: { id: questionId },
        data: { status: "ANSWERED" },
      });
    }

    return successResponse(answer, 201);
  } catch (error) {
    // FIX: Remove the ZodError catch since we're now using safeParse
    // This catch block will only handle unexpected errors
    console.error("Create answer error:", error);
    return errorResponse("Failed to create answer", 500);
  }
}