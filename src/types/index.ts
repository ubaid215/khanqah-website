// src/types/index.ts
import { UserRole, AccountStatus, CourseLevel, CourseStatus, EnrollmentStatus, LessonType } from "@prisma/client";

// ==================== NEXT-AUTH EXTENSIONS ====================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

// ==================== USER TYPES ====================

export interface UserProfile {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  role: UserRole;
  status: AccountStatus;
  createdAt: Date;
  lastLoginAt?: Date | null;
}

export interface UserStats {
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  questionsAsked: number;
  answersGiven: number;
}

// ==================== COURSE TYPES ====================

export interface CourseWithDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  thumbnail?: string | null;
  level: CourseLevel;
  status: CourseStatus;
  duration?: number | null;
  price: number;
  isFree: boolean;
  isPublished: boolean;
  categories: {
    category: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  modules: ModuleWithLessons[];
  _count?: {
    enrollments: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleWithLessons {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  lessons: LessonBasic[];
}

export interface LessonBasic {
  id: string;
  title: string;
  description?: string | null;
  type: LessonType;
  duration?: number | null;
  order: number;
  isFree: boolean;
}

export interface LessonWithProgress extends LessonBasic {
  progress?: {
    isCompleted: boolean;
    watchedDuration: number;
    lastPosition: number;
  } | null;
}

// ==================== ENROLLMENT TYPES ====================

export interface EnrollmentWithCourse {
  id: string;
  status: EnrollmentStatus;
  progress: number;
  completedAt?: Date | null;
  enrolledAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string | null;
    level: CourseLevel;
    duration?: number | null;
  };
}

// ==================== ARTICLE TYPES ====================

export interface ArticleWithTags {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  thumbnail?: string | null;
  status: string;
  readTime?: number | null;
  views: number;
  tags: {
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  createdAt: Date;
  publishedAt?: Date | null;
}

// ==================== BOOK TYPES ====================

export interface BookDetails {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  coverImage?: string | null;
  fileUrl?: string | null;
  pages?: number | null;
  status: string;
  downloads: number;
  createdAt: Date;
  publishedAt?: Date | null;
}

// ==================== Q&A TYPES ====================

export interface QuestionWithAnswers {
  id: string;
  title: string;
  content: string;
  status: string;
  views: number;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  answers: AnswerWithUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AnswerWithUser {
  id: string;
  content: string;
  isAccepted: boolean;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  createdAt: Date;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalArticles: number;
  totalBooks: number;
  totalQuestions: number;
}

export interface UserDashboardData {
  enrolledCourses: EnrollmentWithCourse[];
  recentActivity: ActivityItem[];
  upcomingLessons: LessonBasic[];
  certificates: Certificate[];
}

export interface ActivityItem {
  id: string;
  type: "enrollment" | "completion" | "question" | "answer";
  title: string;
  timestamp: Date;
}

// ==================== PROGRESS TYPES ====================

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lastAccessedLesson?: {
    id: string;
    title: string;
    moduleTitle: string;
  } | null;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: Date;
  pdfUrl?: string | null;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ==================== FORM TYPES ====================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  username?: string;
}

export interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  thumbnail?: string;
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  isFree: boolean;
  categoryIds: string[];
}

export interface LessonFormData {
  title: string;
  description?: string;
  type: LessonType;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isFree: boolean;
}

// ==================== FILTER TYPES ====================

export interface CourseFilters {
  search?: string;
  level?: CourseLevel;
  categoryId?: string;
  isFree?: boolean;
  status?: CourseStatus;
  page?: number;
  limit?: number;
}

export interface ArticleFilters {
  search?: string;
  tagId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ==================== VIDEO PLAYER TYPES ====================

export interface VideoPlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
}