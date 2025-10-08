
// src/app/api/qa/answers/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// PUT /api/qa/answers/[id] - Update answer (owner or admin)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    const answer = await prisma.answer.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!answer) {
      return errorResponse("Answer not found", 404);
    }

    const isOwner = answer.userId === auth.user.id;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(auth.user.role);

    if (!isOwner && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id: params.id },
      data: body,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return successResponse(updatedAnswer);
  } catch (error) {
    console.error("Update answer error:", error);
    return errorResponse("Failed to update answer", 500);
  }
}

// DELETE /api/qa/answers/[id] - Delete answer (owner or admin)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const answer = await prisma.answer.findUnique({
      where: { id: params.id },
      select: { userId: true, questionId: true },
    });

    if (!answer) {
      return errorResponse("Answer not found", 404);
    }

    const isOwner = answer.userId === auth.user.id;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(auth.user.role);

    if (!isOwner && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.answer.delete({
      where: { id: params.id },
    });

    // Check if question has no more answers, update status back to OPEN
    const remainingAnswers = await prisma.answer.count({
      where: { questionId: answer.questionId },
    });

    if (remainingAnswers === 0) {
      await prisma.question.update({
        where: { id: answer.questionId },
        data: { status: "OPEN" },
      });
    }

    return successResponse({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("Delete answer error:", error);
    return errorResponse("Failed to delete answer", 500);
  }
}

// POST /api/qa/answers/[id]/accept - Mark answer as accepted (question owner only)
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const answer = await prisma.answer.findUnique({
      where: { id: params.id },
      include: {
        question: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!answer) {
      return errorResponse("Answer not found", 404);
    }

    // Only question owner can accept answers
    if (answer.question.userId !== auth.user.id) {
      return errorResponse("Only question owner can accept answers", 403);
    }

    // Unaccept all other answers for this question
    await prisma.answer.updateMany({
      where: {
        questionId: answer.question.id,
        isAccepted: true,
      },
      data: { isAccepted: false },
    });

    // Accept this answer
    const acceptedAnswer = await prisma.answer.update({
      where: { id: params.id },
      data: { isAccepted: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return successResponse(acceptedAnswer);
  } catch (error) {
    console.error("Accept answer error:", error);
    return errorResponse("Failed to accept answer", 500);
  }
}