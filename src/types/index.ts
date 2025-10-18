// src/types/index.ts

// First, define the missing enums that are causing "Cannot find name" errors
// These should match your Prisma schema enums
export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
  USER = 'USER'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ALL = 'ALL'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT'
}

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum BookStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum QuestionStatus {
  PENDING = 'PENDING',
  ANSWERED = 'ANSWERED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum BookmarkType {
  COURSE = 'COURSE',
  ARTICLE = 'ARTICLE',
  BOOK = 'BOOK'
}

// Core API response types
export interface ApiResponse<T = any> {
  status: string
  success: boolean
  data?: T
  error?: string
  message?: string
  errors?: Record<string, string>
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  data: T
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Authentication types
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  username?: string
}

export interface AuthUser {
  id: string
  email: string
  username?: string | null
  name?: string | null
  image?: string | null
  bio?: string | null
  role: UserRole
  status: AccountStatus
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date | null
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface UpdateProfileData {
  name?: string
  image?: string
  bio?: string
  username?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// User management types
export interface CreateUserData {
  email: string
  password: string
  name: string
  username?: string
  image?: string
  bio?: string
  role?: UserRole
}

export interface UpdateUserData {
  name?: string
  username?: string
  image?: string
  bio?: string
  role?: UserRole
  status?: AccountStatus
}

export interface UserFilters {
  role?: UserRole
  status?: AccountStatus
  page?: number
  limit?: number
  search?: string
}

// Course types
export interface CreateCourseData {
  title: string
  slug: string
  description: string
  shortDesc?: string
  thumbnail?: string
  level?: CourseLevel
  price?: number
  isFree?: boolean
  categoryIds?: string[]
}

export interface UpdateCourseData {
  title?: string
  description?: string
  shortDesc?: string
  thumbnail?: string
  level?: CourseLevel
  status?: CourseStatus
  price?: number
  isFree?: boolean
  isPublished?: boolean
  publishedAt?: Date | null
  categoryIds?: string[]
}

export interface CourseFilters {
  categorySlug?: string
  level?: CourseLevel
  status?: CourseStatus
  isPublished?: boolean
  page?: number
  limit?: number
}

export interface CourseWithRelations {
  id: string
  title: string
  slug: string
  description: string
  shortDesc?: string | null
  thumbnail?: string | null
  level: CourseLevel
  status: CourseStatus
  duration?: number | null
  price: number
  isFree: boolean
  isPublished: boolean
  categoryNames?: string[]
  avgRating?: number
  reviewCount?: number
  studentCount?: number
  instructor?: any
  objectives?: string[]
  requirements?: string[]
  categories: {
    category: Category
  }[]
  modules: ModuleWithLessons[]
  _count?: {
    enrollments: number
    modules: number
    lessons: number
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

// Module types
export interface CreateModuleData {
  courseId: string
  title: string
  description?: string
  order: number
}

export interface UpdateModuleData {
  title?: string
  description?: string
  order?: number
}

export interface ModuleWithLessons {
  id: string
  courseId: string
  title: string
  description?: string | null
  order: number
  lessons: Lesson[]
  createdAt: Date
  updatedAt: Date
}

// Lesson types
export interface Lesson {
  id: string
  moduleId: string
  title: string
  description?: string | null
  type: LessonType
  content?: string | null
  videoUrl?: string | null
  duration?: number | null
  order: number
  isFree: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateLessonData {
  moduleId: string
  title: string
  description?: string
  type?: LessonType
  content?: string
  videoUrl?: string
  duration?: number
  order: number
  isFree?: boolean
}

export interface UpdateLessonData {
  title?: string
  description?: string
  type?: LessonType
  content?: string
  videoUrl?: string
  duration?: number
  order?: number
  isFree?: boolean
}

export interface LessonProgressData {
  lessonId: string
  isCompleted?: boolean
  watchedDuration?: number
  lastPosition?: number
}

// Enrollment types
export interface EnrollmentWithCourse {
  id: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  progress: number
  completedAt?: Date | null
  enrolledAt: Date
  updatedAt: Date
  course: CourseWithRelations
}

export interface CourseProgress {
  courseId: string
  progress: number
  completedLessons: number
  totalLessons: number
  enrolledAt: Date
  lastActivity?: Date
}

// Article types
export interface CreateArticleData {
  title: string
  slug: string
  content: string
  excerpt?: string
  thumbnail?: string
  tagNames?: string[]
  readTime?: number
}

export interface UpdateArticleData {
  title?: string
  content?: string
  excerpt?: string
  thumbnail?: string
  status?: ArticleStatus
  readTime?: number
  publishedAt?: Date | null
}

export interface ArticleFilters {
  tagSlug?: string
  status?: ArticleStatus
  page?: number
  limit?: number
}

export interface ArticleWithRelations {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  thumbnail?: string | null
  status: ArticleStatus
  readTime?: number | null
  views: number
  tags: {
    tag: Tag
  }[]
  _count?: {
    bookmarks: number
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

// Book types
export interface CreateBookData {
  title: string
  slug: string
  description: string
  author: string
  coverImage?: string
  fileUrl?: string
  pages?: number
}

export interface UpdateBookData {
  title?: string
  description?: string
  author?: string
  coverImage?: string
  fileUrl?: string
  pages?: number
  status?: BookStatus
  publishedAt?: Date | null
}

export interface BookFilters {
  status?: BookStatus
  page?: number
  limit?: number
}

export interface BookWithRelations {
  id: string
  title: string
  slug: string
  description: string
  author: string
  coverImage?: string | null
  fileUrl?: string | null
  pages?: number | null
  status: BookStatus
  downloads: number
  _count?: {
    bookmarks: number
  }
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

// Question & Answer types
export interface CreateQuestionData {
  title: string
  content: string
}

export interface UpdateQuestionData {
  title?: string
  content?: string
  status?: QuestionStatus
}

export interface CreateAnswerData {
  content: string
}

export interface QuestionFilters {
  status?: QuestionStatus
  userId?: string
  page?: number
  limit?: number
}

export interface QuestionWithRelations {
  id: string
  userId: string
  title: string
  content: string
  status: QuestionStatus
  views: number
  user: {
    id: string
    name: string | null
    image: string | null
    username: string | null
  }
  answers: AnswerWithUser[]
  _count?: {
    answers: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface AnswerWithUser {
  id: string
  questionId: string
  userId: string
  content: string
  isAccepted: boolean
  user: {
    id: string
    name: string | null
    image: string | null
    username: string | null
  }
  createdAt: Date
  updatedAt: Date
}

// Bookmark types
export interface CreateBookmarkData {
  type: BookmarkType
  articleId?: string
  bookId?: string
  courseId?: string
}

export interface BookmarkWithRelations {
  id: string
  userId: string
  type: BookmarkType
  articleId?: string | null
  bookId?: string | null
  courseId?: string | null
  article?: ArticleWithRelations | null
  book?: BookWithRelations | null
  course?: CourseWithRelations | null
  createdAt: Date
}

export interface BookmarkFilters {
  type?: BookmarkType
}

// Category & Tag types
export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id: string
  name: string
  slug: string
  _count?: {
    articles: number
  }
}

export interface TagWithCount extends Tag {
  _count: {
    articles: number
  }
}

// Certificate types
export interface Certificate {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  issueDate: Date
  pdfUrl?: string | null
  user: AuthUser
}

// Search types
export interface SearchFilters {
  query: string
  type?: 'courses' | 'articles' | 'books' | 'questions' | 'all'
  page?: number
  limit?: number
}

export interface SearchResults {
  courses: CourseWithRelations[]
  articles: ArticleWithRelations[]
  books: BookWithRelations[]
  questions: QuestionWithRelations[]
  total: number
}

// Dashboard & Analytics types
export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalArticles: number
  totalBooks: number
  totalQuestions: number
  recentEnrollments: EnrollmentWithCourse[]
  popularCourses: CourseWithRelations[]
}

export interface UserStats {
  totalEnrollments: number
  completedCourses: number
  totalProgress: number
  certificates: Certificate[]
  recentActivity: any[]
}

// File upload types
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}

// Form validation types
export interface ValidationError {
  field: string
  message: string
}

export interface FormErrors {
  [key: string]: string
}

// Utility types for API responses
export type ApiSuccess<T = any> = ApiResponse<T> & {
  success: true
  data: T
}

export type ApiError = ApiResponse & {
  success: false
  error: string
}

// Type guards
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiSuccess<T> => {
  return response.success === true && response.status === 'success'
}

export const isApiError = (response: ApiResponse): response is ApiError => {
  return response.success === false && response.status === 'error'
}

// Pagination utility types
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

// Filter types for advanced searching
export interface AdvancedCourseFilters extends CourseFilters {
  minPrice?: number
  maxPrice?: number
  duration?: 'short' | 'medium' | 'long'
  sortBy?: 'popularity' | 'newest' | 'price' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

export interface AdvancedArticleFilters extends ArticleFilters {
  author?: string
  minReadTime?: number
  maxReadTime?: number
  sortBy?: 'popularity' | 'newest' | 'views'
  sortOrder?: 'asc' | 'desc'
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  isRead: boolean
  createdAt: Date
}

export type NotificationType = 
  | 'enrollment'
  | 'course_completion'
  | 'new_lesson'
  | 'answer_received'
  | 'bookmark_reminder'

// Settings types
export interface UserSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  language: string
  theme: 'light' | 'dark' | 'auto'
}

// Re-export Prisma types if needed
// Note: Remove this section if you're having import issues with @prisma/client
export type {
  // These are commented out to avoid import issues
  // User as PrismaUser,
  // Session as PrismaSession,
  // Course as PrismaCourse,
  // Module as PrismaModule,
  // Lesson as PrismaLesson,
  // Enrollment as PrismaEnrollment,
  // LessonProgress as PrismaLessonProgress,
  // Certificate as PrismaCertificate,
  // Category as PrismaCategory,
  // Article as PrismaArticle,
  // Tag as PrismaTag,
  // Book as PrismaBook,
  // Question as PrismaQuestion,
  // Answer as PrismaAnswer,
  // Bookmark as PrismaBookmark
} from '@prisma/client'