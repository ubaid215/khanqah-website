// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

// Tailwind class merge utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==================== API RESPONSE HELPERS ====================

export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function errorResponse(message: string, status = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}

// ==================== AUTH HELPERS ====================

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Define proper return types for requireAuth
type AuthSuccess = {
  authorized: true;
  user: {
    id: string;
    role: UserRole;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

type AuthFailure = {
  authorized: false;
  response: NextResponse;
};

export async function requireAuth(allowedRoles?: UserRole[]): Promise<AuthSuccess | AuthFailure> {
  const session = await getSession();

  // Use optional chaining to safely check session.user
  if (!session?.user) {
    return {
      authorized: false,
      response: errorResponse("Unauthorized", 401),
    };
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      response: errorResponse("Forbidden - Insufficient permissions", 403),
    };
  }

  return {
    authorized: true,
    user: session.user,
  };
}

// ==================== SLUG GENERATION ====================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ==================== PAGINATION HELPERS ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function getPaginationParams(
  searchParams: URLSearchParams
): { skip: number; take: number; page: number } {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 10));

  return {
    page,
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

// ==================== COURSE PROGRESS CALCULATION ====================

export function calculateCourseProgress(
  totalLessons: number,
  completedLessons: number
): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

// ==================== TIME FORMATTING ====================

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

// ==================== DATE FORMATTING ====================

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

// ==================== FILE UPLOAD HELPERS ====================

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

export const FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  VIDEO: ["video/mp4", "video/webm"],
  PDF: ["application/pdf"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// ==================== SEARCH HELPERS ====================

export function buildSearchQuery(searchTerm: string, fields: string[]) {
  if (!searchTerm) return {};

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    })),
  };
}

// ==================== RATE LIMITING ====================

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

// ==================== SANITIZATION ====================

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .substring(0, 10000);
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production use a library like DOMPurify
  return html
    .replace(/<script\b[^<](?:(?!<\/script>)<[^<])*<\/script>/gi, "")
    .replace(/<iframe\b[^<](?:(?!<\/iframe>)<[^<])*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/g, "");
}