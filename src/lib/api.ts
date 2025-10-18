// src/lib/api.ts
import { 
  ApiResponse, 
  AuthResponse, 
  AuthUser, 
  LoginCredentials, 
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  CreateUserData,
  CourseWithRelations,
  CreateCourseData,
  UpdateCourseData,
  CourseFilters,
  ArticleWithRelations,
  CreateArticleData,
  UpdateArticleData,
  ArticleFilters,
  BookWithRelations,
  CreateBookData,
  UpdateBookData,
  BookFilters,
  QuestionWithRelations,
  CreateQuestionData,
  UpdateQuestionData,
  QuestionFilters,
  CreateAnswerData,
  BookmarkWithRelations,
  CreateBookmarkData,
  BookmarkFilters,
  PaginatedResponse,
  UserRole,
  AccountStatus,
  CourseLevel,
  CourseStatus,
  LessonType,
  EnrollmentStatus
} from '@/types'

// Import Prisma types directly
import { 
  Module, 
  Lesson, 
  Enrollment, 
  LessonProgress, 
  Certificate 
} from '@prisma/client'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiClient {
  [x: string]: any
  // Enhanced token management
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private setStoredToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  private removeStoredToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Use the enhanced token getter
    const token = this.getStoredToken()
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      // Handle empty responses (like 204 No Content)
      if (response.status === 204) {
        return { success: true, data: null as any }
      }

      const data = await response.json()

      if (!response.ok) {
        // Create error with proper status code
        const error = new ApiError(
          data.error || 'API request failed',
          response.status,
          data.code,
          data.details
        )

        // Enhanced auth error handling
        if ((response.status === 401 || response.status === 403) && 
            !endpoint.includes('/auth/login') && 
            !endpoint.includes('/auth/register')) {
          this.removeStoredToken()
          // Also clear user data from localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user')
          }
        }

        throw error
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      // Don't remove token on network errors
      throw new ApiError('Network error or server unavailable', 0, 'NETWORK_ERROR')
    }
  }

  // Generic HTTP methods
  async get<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options })
  }

  async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async patch<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options })
  }

  // ==================== AUTHENTICATION METHODS ====================
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials)
    if (response.success && response.data?.token) {
      this.setStoredToken(response.data.token)
    }
    return response.data!
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', userData)
    if (response.success && response.data?.token) {
      this.setStoredToken(response.data.token)
    }
    return response.data!
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout')
    } finally {
      this.removeStoredToken()
      // Also clear user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
      }
    }
  }

  async getProfile(): Promise<ApiResponse<AuthUser>> {
    return this.get<AuthUser>('/auth/profile')
  }

  // Token management with additional checks
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  async updateProfile(profileData: UpdateProfileData): Promise<AuthUser> {
    const response = await this.put<AuthUser>('/auth/profile', profileData)
    return response.data!
  }

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    await this.put('/auth/change-password', passwordData)
  }

  // ==================== USER MANAGEMENT METHODS ====================
  async getUsers(params?: { role?: UserRole; status?: AccountStatus; page?: number; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.get<PaginatedResponse<AuthUser[]>>(`/users${queryString}`)
  }

  async getUserById(id: string): Promise<AuthUser> {
    const response = await this.get<AuthUser>(`/users/${id}`)
    return response.data!
  }

  async createAdmin(userData: CreateUserData): Promise<AuthUser> {
    const response = await this.post<AuthUser>('/auth/admin', userData)
    return response.data!
  }

  async updateUserRole(id: string, role: UserRole): Promise<AuthUser> {
    const response = await this.put<AuthUser>(`/users/${id}/role`, { role })
    return response.data!
  }

  async updateUserStatus(id: string, status: AccountStatus): Promise<AuthUser> {
    const response = await this.put<AuthUser>(`/users/${id}/status`, { status })
    return response.data!
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(`/users/${id}`)
  }

  // ==================== COURSE METHODS ====================
  async getCourses(filters?: CourseFilters): Promise<ApiResponse<PaginatedResponse<CourseWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<CourseWithRelations[]>>(`/courses${queryString}`)
  }

  async getPublicCourses(filters?: Omit<CourseFilters, 'status' | 'isPublished'>): Promise<ApiResponse<PaginatedResponse<CourseWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<CourseWithRelations[]>>(`/courses/public${queryString}`)
  }

  async getCourseById(id: string): Promise<CourseWithRelations> {
    const response = await this.get<CourseWithRelations>(`/courses/${id}`)
    return response.data!
  }

  async getCourseBySlug(slug: string): Promise<CourseWithRelations> {
    const response = await this.get<CourseWithRelations>(`/courses/slug/${slug}`)
    return response.data!
  }

   async createCourse(courseData: CreateCourseData): Promise<CourseWithRelations> {
    console.log('📝 [apiClient] Creating course with data:', {
      ...courseData,
      categoryIds: courseData.categoryIds,
      categoryIdsType: typeof courseData.categoryIds,
      categoryIdsLength: courseData.categoryIds?.length
    })

    const response = await this.post<CourseWithRelations>('/courses', courseData)
    
    console.log('✅ [apiClient] Course creation response:', {
      success: response.success,
      data: response.data,
      categories: response.data?.categories
    })

    return response.data!
  }

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<CourseWithRelations> {
    console.log('📝 [apiClient] Updating course with data:', {
      id,
      ...courseData,
      categoryIds: courseData.categoryIds,
      categoryIdsType: typeof courseData.categoryIds,
      categoryIdsLength: courseData.categoryIds?.length
    })

    const response = await this.put<CourseWithRelations>(`/courses/${id}`, courseData)
    
    console.log('✅ [apiClient] Course update response:', {
      success: response.success,
      data: response.data,
      categories: response.data?.categories
    })

    return response.data!
  }


  async deleteCourse(id: string): Promise<void> {
    await this.delete(`/courses/${id}`)
  }

  async publishCourse(id: string): Promise<CourseWithRelations> {
    const response = await this.put<CourseWithRelations>(`/courses/${id}/publish`)
    return response.data!
  }

  async unpublishCourse(id: string): Promise<CourseWithRelations> {
    const response = await this.put<CourseWithRelations>(`/courses/${id}/unpublish`)
    return response.data!
  }

  // ==================== COURSE ENROLLMENT METHODS ====================
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    const response = await this.post<Enrollment>(`/courses/${courseId}/enroll`)
    return response.data!
  }

 async getUserEnrollment(id: string): Promise<Enrollment | null> {
  console.log("📘 [apiClient] getUserEnrollment() called with:", { id });

  try {
    console.log(`🔍 Sending request to: /courses/${id}/enrollment`);

    const response = await this.get<Enrollment | null>(`/courses/${id}/enrollment`);

    console.log("✅ Enrollment response received:", {
      status: response?.status,
      hasData: !!response?.data,
      data: response?.data,
    });

    return response.data!;
  } catch (error: any) {
    console.error("💥 [apiClient] Error fetching user enrollment:", {
      id,
      message: error.message || error,
      stack: error.stack,
      response: error.response?.data,
    });
    throw error;
  }
}

  async getUserEnrollments(): Promise<Enrollment[]> {
    const response = await this.get<Enrollment[]>('/courses/enrollments/my')
    return response.data!
  }

  async updateEnrollmentProgress(enrollmentId: string, progress: number): Promise<Enrollment> {
    const response = await this.put<Enrollment>(`/enrollments/${enrollmentId}/progress`, { progress })
    return response.data!
  }

  // ==================== MODULE METHODS ====================
  async createModule(data: {
    courseId: string;
    title: string;
    description?: string;
    order: number;
  }): Promise<Module> {
    const response = await this.post<Module>('/courses/modules', data)
    return response.data!
  }

  async updateModule(id: string, data: Partial<{
    title?: string;
    description?: string;
    order?: number;
  }>): Promise<Module> {
    const response = await this.put<Module>(`/courses/modules/${id}`, data)
    return response.data!
  }

  async deleteModule(id: string): Promise<void> {
    await this.delete(`/courses/modules/${id}`)
  }

  // ==================== LESSON METHODS ====================
  async createLesson(data: {
    moduleId: string;
    title: string;
    description?: string;
    type?: LessonType;
    content?: string;
    videoUrl?: string;
    duration?: number;
    order: number;
    isFree?: boolean;
  }): Promise<Lesson> {
    const response = await this.post<Lesson>('/courses/lessons', data)
    return response.data!
  }

  async updateLesson(id: string, data: Partial<{
    title?: string;
    description?: string;
    type?: LessonType;
    content?: string;
    videoUrl?: string;
    duration?: number;
    order?: number;
    isFree?: boolean;
  }>): Promise<Lesson> {
    const response = await this.put<Lesson>(`/courses/lessons/${id}`, data)
    return response.data!
  }

  async deleteLesson(id: string): Promise<void> {
    await this.delete(`/courses/lessons/${id}`)
  }

  // ==================== PROGRESS TRACKING METHODS ====================
  async updateLessonProgress(data: {
    lessonId: string;
    isCompleted?: boolean;
    watchedDuration?: number;
    lastPosition?: number;
  }): Promise<LessonProgress> {
    const response = await this.put<LessonProgress>('/courses/progress', data)
    return response.data!
  }

  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const response = await this.get<LessonProgress | null>(`/courses/progress/${lessonId}`)
    return response.data!
  }

  async getCourseProgress(courseId: string): Promise<{
    completedLessons: number;
    totalLessons: number;
    progress: number;
    enrollment?: Enrollment;
  }> {
    const response = await this.get<{
      completedLessons: number;
      totalLessons: number;
      progress: number;
      enrollment?: Enrollment;
    }>(`/courses/${courseId}/progress`)
    return response.data!
  }

  // ==================== CERTIFICATE METHODS ====================
  async createCertificate(data: {
    courseId: string;
    courseTitle: string;
    pdfUrl?: string;
  }): Promise<Certificate> {
    const response = await this.post<Certificate>('/certificates', data)
    return response.data!
  }

  async getUserCertificates(): Promise<Certificate[]> {
    const response = await this.get<Certificate[]>('/certificates/my')
    return response.data!
  }

  async getCertificateById(id: string): Promise<Certificate> {
    const response = await this.get<Certificate>(`/certificates/${id}`)
    return response.data!
  }

  async downloadCertificate(id: string): Promise<{ downloadUrl: string }> {
    const response = await this.post<{ downloadUrl: string }>(`/certificates/${id}/download`)
    return response.data!
  }

  // ==================== ARTICLE METHODS ====================
  async getArticles(filters?: ArticleFilters): Promise<ApiResponse<PaginatedResponse<ArticleWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<ArticleWithRelations[]>>(`/articles${queryString}`)
  }

  async getPublicArticles(filters?: Omit<ArticleFilters, 'status'>): Promise<ApiResponse<PaginatedResponse<ArticleWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<ArticleWithRelations[]>>(`/articles/public${queryString}`)
  }

  async getArticleById(id: string): Promise<ArticleWithRelations> {
    const response = await this.get<ArticleWithRelations>(`/articles/${id}`)
    return response.data!
  }

async getArticleBySlug(slug: string): Promise<ArticleWithRelations> {
  try {
    const response = await this.get<ArticleWithRelations>(`/articles/slug/${slug}`)
    return response.data!
  } catch (error: any) {
    // Re-throw the error with proper context
    throw error
  }
}

// Add a dedicated method for checking slug availability
async checkSlugAvailability(slug: string): Promise<{ available: boolean }> {
  try {
    const response = await this.get<{ available: boolean }>(`/articles/check-slug/${slug}`)
    return response.data!
  } catch (error: any) {
    console.error('Error checking slug availability:', error)
    // On error, assume slug is not available to be safe
    return { available: false }
  }
}

  // In your api.ts file, update the createArticle method:
async createArticle(articleData: CreateArticleData): Promise<any> {
  try {
    const response = await this.post<ArticleWithRelations>('/articles', articleData)
    
    // FIXED: Better response handling
    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Article created successfully'
      }
    } else {
      // If the API returns an error response
      return {
        success: false,
        error: response.error || 'Failed to create article',
        data: null
      }
    }
  } catch (error: any) {
    console.error('API Client - Create article error:', error)
    
    // Handle different error types
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        status: error.status
      }
    }
    
    return {
      success: false,
      error: 'Network error or server unavailable'
    }
  }
}

  async updateArticle(id: string, articleData: UpdateArticleData): Promise<ArticleWithRelations> {
    const response = await this.put<ArticleWithRelations>(`/articles/${id}`, articleData)
    return response.data!
  }

  async publishArticle(id: string): Promise<ArticleWithRelations> {
    const response = await this.put<ArticleWithRelations>(`/articles/${id}/publish`)
    return response.data!
  }

  async deleteArticle(id: string): Promise<void> {
    await this.delete(`/articles/${id}`)
  }

  async getTags(): Promise<any[]> {
    const response = await this.get<any[]>('/articles/tags')
    return response.data!
  }

  async getPopularTags(limit?: number): Promise<any[]> {
    const queryString = limit ? `?limit=${limit}` : ''
    const response = await this.get<any[]>(`/articles/tags/popular${queryString}`)
    return response.data!
  }

  // ==================== BOOK METHODS ====================
  async getBooks(filters?: BookFilters): Promise<ApiResponse<PaginatedResponse<BookWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<BookWithRelations[]>>(`/books${queryString}`)
  }

  async getPublicBooks(filters?: Omit<BookFilters, 'status'>): Promise<ApiResponse<PaginatedResponse<BookWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<BookWithRelations[]>>(`/books/public${queryString}`)
  }

  async getBookById(id: string): Promise<BookWithRelations> {
    const response = await this.get<BookWithRelations>(`/books/${id}`)
    return response.data!
  }

  async getBookBySlug(slug: string): Promise<BookWithRelations> {
    const response = await this.get<BookWithRelations>(`/books/slug/${slug}`)
    return response.data!
  }

  async createBook(bookData: CreateBookData): Promise<BookWithRelations> {
    const response = await this.post<BookWithRelations>('/books', bookData)
    return response.data!
  }

  async updateBook(id: string, bookData: UpdateBookData): Promise<BookWithRelations> {
    const response = await this.put<BookWithRelations>(`/books/${id}`, bookData)
    return response.data!
  }

  async publishBook(id: string): Promise<BookWithRelations> {
    const response = await this.put<BookWithRelations>(`/books/${id}/publish`)
    return response.data!
  }

  async deleteBook(id: string): Promise<void> {
    await this.delete(`/books/${id}`)
  }

  async downloadBook(id: string): Promise<{ downloadUrl: string }> {
    const response = await this.post<{ downloadUrl: string }>(`/books/${id}/download`)
    return response.data!
  }

  async getPopularBooks(limit?: number): Promise<BookWithRelations[]> {
    const queryString = limit ? `?limit=${limit}` : ''
    const response = await this.get<BookWithRelations[]>(`/books/popular${queryString}`)
    return response.data!
  }

  // ==================== QUESTION & ANSWER METHODS ====================
  async getQuestions(filters?: QuestionFilters): Promise<ApiResponse<PaginatedResponse<QuestionWithRelations[]>>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    return this.get<PaginatedResponse<QuestionWithRelations[]>>(`/questions${queryString}`)
  }

  async getQuestionById(id: string): Promise<QuestionWithRelations> {
    const response = await this.get<QuestionWithRelations>(`/questions/${id}`)
    return response.data!
  }

  async createQuestion(questionData: CreateQuestionData): Promise<QuestionWithRelations> {
    const response = await this.post<QuestionWithRelations>('/questions', questionData)
    return response.data!
  }

  async updateQuestion(id: string, questionData: UpdateQuestionData): Promise<QuestionWithRelations> {
    const response = await this.put<QuestionWithRelations>(`/questions/${id}`, questionData)
    return response.data!
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.delete(`/questions/${id}`)
  }

  async createAnswer(questionId: string, answerData: CreateAnswerData): Promise<any> {
    const response = await this.post(`/questions/${questionId}/answers`, answerData)
    return response.data!
  }

  async acceptAnswer(answerId: string): Promise<any> {
    const response = await this.put(`/answers/${answerId}/accept`)
    return response.data!
  }

  async deleteAnswer(answerId: string): Promise<void> {
    await this.delete(`/answers/${answerId}`)
  }

  // ==================== BOOKMARK METHODS ====================
  async getBookmarks(filters?: BookmarkFilters): Promise<BookmarkWithRelations[]> {
    const params = new URLSearchParams()
    
    if (filters?.type) {
      params.append('type', filters.type)
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await this.get<BookmarkWithRelations[]>(`/bookmarks${queryString}`)
    return response.data!
  }

  async createBookmark(bookmarkData: CreateBookmarkData): Promise<BookmarkWithRelations> {
    const response = await this.post<BookmarkWithRelations>('/bookmarks', bookmarkData)
    return response.data!
  }

  async checkBookmark(data: Omit<CreateBookmarkData, 'userId'>): Promise<{ isBookmarked: boolean }> {
    const params = new URLSearchParams()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await this.get<{ isBookmarked: boolean }>(`/bookmarks/check${queryString}`)
    return response.data!
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    await this.delete(`/bookmarks/${bookmarkId}`)
  }

  async deleteBookmarkByResource(data: Omit<CreateBookmarkData, 'userId'>): Promise<void> {
    // Fixed the comparison issue by properly handling the data
    await this.delete('/bookmarks/resource', {
      body: JSON.stringify(data)
    })
  }

  async getBookmarkCount(data: Omit<CreateBookmarkData, 'userId' | 'type'>): Promise<{ count: number }> {
    const params = new URLSearchParams()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const response = await this.get<{ count: number }>(`/bookmarks/count${queryString}`)
    return response.data!
  }

  // ==================== UTILITY METHODS ====================

// Add this method to handle file uploads with progress
async uploadFileWithProgress(
  file: File, 
  onProgress?: (progress: number) => void
): Promise<{ url: string; filename: string; size: number; mimetype: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const token = this.getStoredToken()
  
  if (!token) {
    throw new ApiError('Authentication token not found', 401)
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100
          onProgress(Math.round(progress))
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            resolve(response.data)
          } else {
            reject(new ApiError(response.error || 'Upload failed', xhr.status))
          }
        } catch (error) {
          reject(new ApiError('Failed to parse upload response', xhr.status))
        }
      } else {
        // Try to parse error response
        try {
          const errorResponse = JSON.parse(xhr.responseText)
          reject(new ApiError(errorResponse.error || 'Upload failed', xhr.status))
        } catch {
          reject(new ApiError('Upload failed', xhr.status))
        }
      }
    })

    xhr.addEventListener('error', () => {
      reject(new ApiError('Network error during upload', 0))
    })

    xhr.addEventListener('abort', () => {
      reject(new ApiError('Upload cancelled', 0))
    })

    xhr.open('POST', `${API_BASE_URL}/upload`)
    
    // Set authorization header
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    
    xhr.send(formData)
  })
}


  async uploadFile(file: File): Promise<{ url: string; filename: string; size: number; mimetype: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const token = this.getStoredToken()
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(data.error || 'Upload failed', response.status)
    }

    return data.data
  }

  async search(query: string, type?: string): Promise<any> {
    const params = new URLSearchParams()
    params.append('q', query)
    
    if (type) {
      params.append('type', type)
    }
    
    const queryString = params.toString()
    const response = await this.get(`/search?${queryString}`)
    return response.data!
  }

  async getDashboardStats(): Promise<any> {
    const response = await this.get('/dashboard/stats')
    return response.data!
  }

  async getHealth(): Promise<any> {
    const response = await this.get('/health')
    return response.data!
  }

  // ==================== CATEGORY METHODS ====================
  async getCategories(): Promise<any[]> {
    try {
      const response = await this.get<any[]>('/categories')
      console.log('📚 [apiClient] Categories response:', {
        success: response.success,
        dataLength: response.data?.length,
        data: response.data
      })
      return response.data!
    } catch (error) {
      console.error('❌ [apiClient] Failed to fetch categories:', error)
      throw error
    }
  }

  async createCategory(data: { name: string }): Promise<any> {
    console.log('📝 [apiClient] Creating category:', data)
    
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    const categoryData = {
      ...data,
      slug,
      icon: '📚' // Default icon
    }

    const response = await this.post<any>('/categories', categoryData)
    
    console.log('✅ [apiClient] Category creation response:', {
      success: response.success,
      data: response.data
    })

    return response.data!
  }

  async getCategoryBySlug(slug: string): Promise<any> {
    const response = await this.get<any>(`/categories/slug/${slug}`)
    return response.data!
  }


  async updateCategory(id: string, data: Partial<{ name: string; slug: string; description?: string; icon?: string }>): Promise<any> {
    const response = await this.put<any>(`/categories/${id}`, data)
    return response.data!
  }

  async deleteCategory(id: string): Promise<void> {
    await this.delete(`/categories/${id}`)
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export error class
export { ApiError }