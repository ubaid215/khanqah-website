// src/app/api/upload/route.ts
import { NextRequest } from "next/server";
import {
  successResponse,
  errorResponse,
  requireAuth,
  validateFileType,
  validateFileSize,
  FILE_TYPES,
} from "@/lib/utils";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// POST /api/upload - Upload file
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const auth = await requireAuth();
    if (!auth.authorized) return auth.response;

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'image', 'video', 'document', 'pdf'

    if (!file) {
      return errorResponse("No file provided", 400);
    }

    // Validate file type based on upload category
    let allowedTypes: string[] = [];
    let maxSizeMB = 10; // Default 10MB

    switch (type) {
      case "image":
        allowedTypes = FILE_TYPES.IMAGE;
        maxSizeMB = 5; // 5MB for images
        break;
      case "video":
        allowedTypes = FILE_TYPES.VIDEO;
        maxSizeMB = 500; // 500MB for videos
        break;
      case "pdf":
        allowedTypes = FILE_TYPES.PDF;
        maxSizeMB = 20; // 20MB for PDFs
        break;
      case "document":
        allowedTypes = FILE_TYPES.DOCUMENT;
        maxSizeMB = 20; // 20MB for documents
        break;
      default:
        return errorResponse("Invalid upload type", 400);
    }

    // Validate file type
    if (!validateFileType(file, allowedTypes)) {
      return errorResponse(
        `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
        400
      );
    }

    // Validate file size
    if (!validateFileSize(file, maxSizeMB)) {
      return errorResponse(`File size exceeds ${maxSizeMB}MB limit`, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;

    // Determine upload directory based on type
    const uploadDir = join(process.cwd(), "public", "uploads", type);

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Generate public URL (Next.js serves /public as root)
    const fileUrl = `/uploads/${type}/${fileName}`;

    // Return success response
    return successResponse({
      url: fileUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("File upload error:", error);
    return errorResponse("Failed to upload file", 500);
  }
}
