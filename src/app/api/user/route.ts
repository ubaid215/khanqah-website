// src/app/api/user/profile/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { updateProfileSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/user/profile - Get current user profile
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        role: true,
        status: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: {
            enrollments: true,
            questions: true,
            answers: true,
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse(user);
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse("Failed to fetch profile", 500);
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;

    // Check if username is already taken
    if (validatedData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedData.username,
          NOT: { id: auth.user.id },
        },
      });

      if (existingUser) {
        return errorResponse("Username already taken", 400);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: auth.user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Update profile error:", error);
    return errorResponse("Failed to update profile", 500);
  }
}