// src/lib/validations.ts
import { z } from "zod";

// ==================== AUTH VALIDATIONS ====================

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).max(20).optional(),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ==================== COURSE VALIDATIONS ====================

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDesc: z.string().max(200).optional(),
  thumbnail: z.string().url().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  price: z.number().min(0).default(0),
  isFree: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
});

export const moduleSchema = z.object({
  courseId: z.string().cuid(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  order: z.number().int().min(1),
});

export const lessonSchema = z.object({
  moduleId: z.string().cuid(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["VIDEO", "ARTICLE", "QUIZ", "ASSIGNMENT"]),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().min(1),
  isFree: z.boolean().default(false),
});

// ==================== ARTICLE VALIDATIONS ====================

export const articleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(300).optional(),
  thumbnail: z.string().url().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  readTime: z.number().int().min(1).optional(),
  tagIds: z.array(z.string()).optional(),
});

// ==================== BOOK VALIDATIONS ====================

export const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
  coverImage: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
  pages: z.number().int().min(1).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});

// ==================== Q&A VALIDATIONS ====================

export const questionSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
});

export const answerSchema = z.object({
  content: z.string().min(10, "Answer must be at least 10 characters"),
});

// ==================== PROGRESS VALIDATIONS ====================

// FIXED: Match Prisma schema field names
export const progressUpdateSchema = z.object({
  lessonId: z.string().cuid("Invalid lesson ID"),
  isCompleted: z.boolean().default(false),
  watchedDuration: z.number().int().min(0).optional(),
  lastPosition: z.number().int().min(0).optional(),
});

// Alternative schema if you prefer different field names
export const progressUpdateAltSchema = z.object({
  lessonId: z.string().cuid("Invalid lesson ID"),
  completed: z.boolean().default(false), // Maps to isCompleted
  timeWatched: z.number().int().min(0).optional(), // Maps to watchedDuration
}).transform((data) => ({
  lessonId: data.lessonId,
  isCompleted: data.completed,
  watchedDuration: data.timeWatched,
  lastPosition: data.timeWatched, // Optional: use timeWatched as lastPosition
}));

// ==================== ENROLLMENT VALIDATIONS ====================

export const enrollmentSchema = z.object({
  courseId: z.string().cuid(),
});

// ==================== BOOKMARK VALIDATIONS ====================

export const bookmarkSchema = z.object({
  type: z.enum(["ARTICLE", "BOOK", "COURSE"]),
  articleId: z.string().cuid().optional(),
  bookId: z.string().cuid().optional(),
  courseId: z.string().cuid().optional(),
}).refine((data) => {
  // Ensure at least one ID is provided based on type
  if (data.type === "ARTICLE" && !data.articleId) return false;
  if (data.type === "BOOK" && !data.bookId) return false;
  if (data.type === "COURSE" && !data.courseId) return false;
  return true;
}, {
  message: "ID is required for the selected type",
});

// ==================== CERTIFICATE VALIDATIONS ====================

export const certificateSchema = z.object({
  courseId: z.string().cuid(),
  courseTitle: z.string().min(3, "Course title is required"),
});

// Type exports
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type ModuleInput = z.infer<typeof moduleSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type BookInput = z.infer<typeof bookSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
export type ProgressUpdateAltInput = z.infer<typeof progressUpdateAltSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type BookmarkInput = z.infer<typeof bookmarkSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;