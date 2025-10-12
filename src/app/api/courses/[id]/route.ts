// src/app/api/courses/[id]/route.ts
import { NextRequest } from "next/server";
import { CourseController } from "@/controllers/CourseController";
import { requireAdmin } from "@/middleware/auth";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  return await CourseController.getCourse(req, context);
}

export const PUT = requireAdmin(
  async (req: NextRequest, context: { params: { id: string } }) => {
    return CourseController.updateCourse(req, context);
  }
);

export const DELETE = requireAdmin(
  async (req: NextRequest, context: { params: { id: string } }) => {
    return CourseController.deleteCourse(req, context);
  }
);
