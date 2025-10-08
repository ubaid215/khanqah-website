// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { UserRole, AccountStatus } from "@prisma/client";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    // FIX: Corrected regex pattern - removed extra dots
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // FIX: Use safeParse instead of parse for better error handling
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      // FIX: Use the correct property 'issues' instead of 'errors'
      const errorDetails = validationResult.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: errorDetails 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.username ? [{ username: validatedData.username }] : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        username: validatedData.username,
        // FIX: Use proper enum values instead of string literals
        role: UserRole.USER,
        status: AccountStatus.ACTIVE,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    // FIX: Remove ZodError catch since we're using safeParse above
    // This catch block now only handles unexpected errors
    
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}