// src/app/api/qa/questions/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/qa/questions/[id] - Get single question with answers
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        answers: {
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
          orderBy: [
            { isAccepted: "desc" },
            { createdAt: "asc" },
          ],
        },
      },
    });

    if (!question) {
      return errorResponse("Question not found", 404);
    }

    // Increment views
    await prisma.question.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return successResponse(question);
  } catch (error) {
    console.error("Get question error:", error);
    return errorResponse("Failed to fetch question", 500);
  }
}

// PUT /api/qa/questions/[id] - Update question (owner or admin)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    // Get question to check ownership
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!question) {
      return errorResponse("Question not found", 404);
    }

    // Check if user is owner or admin
    const isOwner = question.userId === auth.user.id;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(auth.user.role);

    if (!isOwner && !isAdmin) {
      return errorResponse("Forbidden - Not authorized to edit this question", 403);
    }

    const updatedQuestion = await prisma.question.update({
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

    return successResponse(updatedQuestion);
  } catch (error) {
    console.error("Update question error:", error);
    return errorResponse("Failed to update question", 500);
  }
}

// DELETE /api/qa/questions/[id] - Delete question (owner or admin)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const question = await prisma.question.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!question) {
      return errorResponse("Question not found", 404);
    }

    const isOwner = question.userId === auth.user.id;
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(auth.user.role);

    if (!isOwner && !isAdmin) {
      return errorResponse("Forbidden", 403);
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete question error:", error);
    return errorResponse("Failed to delete question", 500);
  }
}