// src/app/api/user/password/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { changePasswordSchema } from "@/lib/validations";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

// PUT /api/user/password - Change password
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = changePasswordSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorMessages = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return errorResponse("Validation error", 400, errorMessages);
    }

    const validatedData = validationResult.data;

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      select: { password: true },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Verify current password
    const isPasswordValid = await compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse("Current password is incorrect", 400);
    }

    // Hash new password
    const hashedPassword = await hash(validatedData.newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: auth.user.id },
      data: { password: hashedPassword },
    });

    return successResponse({ message: "Password changed successfully" });
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    console.error("Change password error:", error);
    return errorResponse("Failed to change password", 500);
  }
}