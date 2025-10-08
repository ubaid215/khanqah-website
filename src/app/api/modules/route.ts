// src/app/api/modules/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { moduleSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/lessons/[id]/access - Check if user has access to lesson
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                isFree: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return errorResponse("Lesson not found", 404);
    }

    // Free lessons are accessible to everyone
    if (lesson.isFree || lesson.module.course.isFree) {
      return successResponse({ hasAccess: true, reason: "free" });
    }

    // Check authentication for paid lessons
    const auth = await requireAuth();
    if (!auth.authorized) {
      return successResponse({ hasAccess: false, reason: "not_authenticated" });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: auth.user.id,
          courseId: lesson.module.course.id,
        },
      },
    });

    if (!enrollment) {
      return successResponse({ hasAccess: false, reason: "not_enrolled" });
    }

    return successResponse({ hasAccess: true, reason: "enrolled" });
  } catch (error) {
    console.error("Check access error:", error);
    return errorResponse("Failed to check access", 500);
  }
}modules?courseId=xxx - Get modules for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return errorResponse("Course ID is required", 400);
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            title: true,
            type: true,
            duration: true,
            order: true,
            isFree: true,
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return successResponse(modules);
  } catch (error) {
    console.error("Get modules error:", error);
    return errorResponse("Failed to fetch modules", 500);
  }
}

// POST /api/modules - Create new module (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const validatedData = moduleSchema.parse(body);

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: validatedData.courseId },
    });

    if (!course) {
      return errorResponse("Course not found", 404);
    }

    const module = await prisma.module.create({
      data: validatedData,
    });

    return successResponse(module, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation error", 400, error.errors);
    }
    console.error("Create module error:", error);
    return errorResponse("Failed to create module", 500);
  }
}

// =================================================

// src/app/api/modules/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/modules/[id] - Get single module
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const module = await prisma.module.findUnique({
      where: { id: params.id },
      include: {
        lessons: {
          orderBy: { order: "asc" },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!module) {
      return errorResponse("Module not found", 404);
    }

    return successResponse(module);
  } catch (error) {
    console.error("Get module error:", error);
    return errorResponse("Failed to fetch module", 500);
  }
}

// PUT /api/modules/[id] - Update module (admin only)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    const module = await prisma.module.update({
      where: { id: params.id },
      data: body,
    });

    return successResponse(module);
  } catch (error) {
    console.error("Update module error:", error);
    return errorResponse("Failed to update module", 500);
  }
}

// DELETE /api/modules/[id] - Delete module (admin only)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    await prisma.module.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Delete module error:", error);
    return errorResponse("Failed to delete module", 500);
  }
}

// =================================================

// src/app/api/lessons/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";
import { lessonSchema } from "@/lib/validations";
import { z } from "zod";

// GET /api/lessons?moduleId=xxx - Get lessons for a module
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");

    if (!moduleId) {
      return errorResponse("Module ID is required", 400);
    }

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return successResponse(lessons);
  } catch (error) {
    console.error("Get lessons error:", error);
    return errorResponse("Failed to fetch lessons", 500);
  }
}

// POST /api/lessons - Create new lesson (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();
    const validatedData = lessonSchema.parse(body);

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: { id: validatedData.moduleId },
    });

    if (!module) {
      return errorResponse("Module not found", 404);
    }

    const lesson = await prisma.lesson.create({
      data: validatedData,
    });

    return successResponse(lesson, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse("Validation error", 400, error.errors);
    }
    console.error("Create lesson error:", error);
    return errorResponse("Failed to create lesson", 500);
  }
}

// =================================================

// src/app/api/lessons/[id]/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/lessons/[id] - Get single lesson with access check
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        module: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
                isFree: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return errorResponse("Lesson not found", 404);
    }

    // Check if lesson is free or user is enrolled
    if (!lesson.isFree && !lesson.module.course.isFree) {
      const auth = await requireAuth();
      if (!auth.authorized) return auth.response;

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: auth.user.id,
            courseId: lesson.module.course.id,
          },
        },
      });

      if (!enrollment) {
        return errorResponse("Not enrolled in this course", 403);
      }

      // Get user's progress for this lesson
      const progress = await prisma.lessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId: auth.user.id,
            lessonId: params.id,
          },
        },
      });

      return successResponse({
        ...lesson,
        progress,
      });
    }

    return successResponse(lesson);
  } catch (error) {
    console.error("Get lesson error:", error);
    return errorResponse("Failed to fetch lesson", 500);
  }
}

// PUT /api/lessons/[id] - Update lesson (admin only)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    const body = await request.json();

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: body,
    });

    return successResponse(lesson);
  } catch (error) {
    console.error("Update lesson error:", error);
    return errorResponse("Failed to update lesson", 500);
  }
}

// DELETE /api/lessons/[id] - Delete lesson (admin only)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    if (!auth.authorized) return auth.response;

    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return successResponse({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Delete lesson error:", error);
    return errorResponse("Failed to delete lesson", 500);
  }
}

// =================================================

// src/app/api/lessons/[id]/access/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, requireAuth } from "@/lib/utils";

interface RouteContext {
  params: {
    id: string;
  };
}

// GET /api/