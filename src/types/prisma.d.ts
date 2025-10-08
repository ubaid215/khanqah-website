// src/types/prisma.d.ts
import { Prisma } from '@prisma/client';

// Re-export all Prisma types
export type { Prisma };

// Extended Prisma namespace declarations
declare module '@prisma/client' {
  export namespace Prisma {
    // ==================== ARTICLE TYPES ====================
    export type ArticleWhereInput = any;
    export type ArticleInclude = any;
    export type ArticleOrderByWithRelationInput = any;
    export type ArticleGetPayload<T> = any;

    // ==================== BOOK TYPES ====================
    export type BookWhereInput = any;
    export type BookInclude = any;
    export type BookOrderByWithRelationInput = any;
    export type BookGetPayload<T> = any;

    // ==================== COURSE TYPES ====================
    export type CourseWhereInput = any;
    export type CourseInclude = any;
    export type CourseOrderByWithRelationInput = any;
    export type CourseGetPayload<T> = any;

    // ==================== QUESTION TYPES ====================
    export type QuestionWhereInput = any;
    export type QuestionInclude = any;
    export type QuestionOrderByWithRelationInput = any;
    export type QuestionGetPayload<T> = any;

    // ==================== USER TYPES ====================
    export type UserWhereInput = any;
    export type UserInclude = any;
    export type UserOrderByWithRelationInput = any;
    export type UserGetPayload<T> = any;

    // ==================== CATEGORY TYPES ====================
    export type CategoryWhereInput = any;
    export type CategoryInclude = any;
    export type CategoryOrderByWithRelationInput = any;
    export type CategoryGetPayload<T> = any;

    // ==================== CHAPTER TYPES ====================
    export type ChapterWhereInput = any;
    export type ChapterInclude = any;
    export type ChapterOrderByWithRelationInput = any;
    export type ChapterGetPayload<T> = any;

    // ==================== LESSON TYPES ====================
    export type LessonWhereInput = any;
    export type LessonInclude = any;
    export type LessonOrderByWithRelationInput = any;
    export type LessonGetPayload<T> = any;

    // ==================== ANSWER TYPES ====================
    export type AnswerWhereInput = any;
    export type AnswerInclude = any;
    export type AnswerOrderByWithRelationInput = any;
    export type AnswerGetPayload<T> = any;

    // ==================== ENROLLMENT TYPES ====================
    export type EnrollmentWhereInput = any;
    export type EnrollmentInclude = any;
    export type EnrollmentOrderByWithRelationInput = any;
    export type EnrollmentGetPayload<T> = any;

    // ==================== PROGRESS TYPES ====================
    export type ProgressWhereInput = any;
    export type ProgressInclude = any;
    export type ProgressOrderByWithRelationInput = any;
    export type ProgressGetPayload<T> = any;

    // ==================== TAG TYPES ====================
    export type TagWhereInput = any;
    export type TagInclude = any;
    export type TagOrderByWithRelationInput = any;
    export type TagGetPayload<T> = any;

    // ==================== ARTICLE TAG TYPES ====================
    export type ArticleTagWhereInput = any;
    export type ArticleTagInclude = any;
    export type ArticleTagOrderByWithRelationInput = any;
    export type ArticleTagGetPayload<T> = any;

    // ==================== CERTIFICATE TYPES ====================
    export type CertificateWhereInput = any;
    export type CertificateInclude = any;
    export type CertificateOrderByWithRelationInput = any;
    export type CertificateGetPayload<T> = any;
  }
}

// ==================== ENUM DECLARATIONS ====================
declare module '@prisma/client' {
  // User Role Enum
  export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    INSTRUCTOR = 'INSTRUCTOR',
    SUPER_ADMIN = "SUPER_ADMIN"
  }

  // Course Level Enum
  export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED'
  }

  // Course Status Enum
  export enum CourseStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED'
  }

  // Question Status Enum
  export enum QuestionStatus {
    OPEN = 'OPEN',
    ANSWERED = 'ANSWERED',
    CLOSED = 'CLOSED'
  }
}

// ==================== CUSTOM TYPE INTERFACES ====================

// Article related interfaces
export interface ArticleWhereInput {
  id?: string;
  slug?: string;
  title?: string;
  isPublished?: boolean;
  publishedAt?: {
    lte?: Date;
    gte?: Date;
  };
  tags?: {
    some?: {
      tag?: {
        id?: string;
        name?: string;
        slug?: string;
      };
    };
  };
}

export interface BookWhereInput {
  id?: string;
  slug?: string;
  title?: string;
  author?: string;
  isPublished?: boolean;
  isbn?: string;
}

export interface CourseWhereInput {
  id?: string;
  slug?: string;
  title?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  categoryId?: string;
  isPublished?: boolean;
  price?: number;
}

export interface QuestionWhereInput {
  id?: string;
  slug?: string;
  title?: string;
  status?: QuestionStatus;
  userId?: string;
  voteCount?: number;
}

export interface UserWhereInput {
  id?: string;
  email?: string;
  name?: string;
  role?: UserRole;
}

// Include types
export interface ArticleInclude {
  tags?: {
    include: {
      tag: boolean;
    };
  };
}

export interface BookInclude {
  // Add book relations as needed
}

export interface CourseInclude {
  category?: boolean;
  chapters?: {
    include?: {
      lessons?: boolean;
    };
  };
  enrollments?: boolean;
}

export interface QuestionInclude {
  user?: boolean;
  answers?: {
    include?: {
      user?: boolean;
    };
  };
}

export interface UserInclude {
  enrollments?: {
    include?: {
      course?: boolean;
    };
  };
  progress?: boolean;
  questions?: boolean;
  answers?: boolean;
}

// Order By types
export interface ArticleOrderByWithRelationInput {
  id?: 'asc' | 'desc';
  title?: 'asc' | 'desc';
  publishedAt?: 'asc' | 'desc';
  viewCount?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
}

export interface BookOrderByWithRelationInput {
  id?: 'asc' | 'desc';
  title?: 'asc' | 'desc';
  author?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
}

export interface CourseOrderByWithRelationInput {
  id?: 'asc' | 'desc';
  title?: 'asc' | 'desc';
  level?: 'asc' | 'desc';
  price?: 'asc' | 'desc';
  publishedAt?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
}

export interface QuestionOrderByWithRelationInput {
  id?: 'asc' | 'desc';
  title?: 'asc' | 'desc';
  voteCount?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
}

export interface UserOrderByWithRelationInput {
  id?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  email?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
}

// Payload types for relations
export interface ArticleGetPayload<T> {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  isPublished: boolean;
  viewCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface BookGetPayload<T> {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  pages?: number;
  isbn?: string;
  isPublished: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseGetPayload<T> {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: CourseLevel;
  status: CourseStatus;
  price: number;
  categoryId?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  chapters?: Array<{
    id: string;
    title: string;
    position: number;
    isPublished: boolean;
  }>;
}

export interface QuestionGetPayload<T> {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: QuestionStatus;
  viewCount: number;
  voteCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  answers?: Array<{
    id: string;
    content: string;
    isAccepted: boolean;
    voteCount: number;
    userId: string;
    createdAt: Date;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

export interface UserGetPayload<T> {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  enrollments?: Array<{
    id: string;
    enrolledAt: Date;
    completedAt?: Date;
    course?: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

// ==================== TYPE GUARDS ====================

// Type guard to check if we're using actual Prisma types or fallbacks
export type SafePrismaType<T> = 
  typeof globalThis extends { Prisma: { [K in keyof T]: any } } 
    ? T 
    : any;

// Utility type to safely use Prisma types
export type WithPrismaFallback<T> = T extends any ? T : any;

// ==================== EXPORT ALL TYPES ====================

export {
  UserRole,
  CourseLevel,
  CourseStatus,
  QuestionStatus
};