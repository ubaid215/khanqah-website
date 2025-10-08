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
  AccountStatus
} from '@/types'

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
  private async request<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    
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
      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          data.error || 'API request failed',
          response.status,
          data.code,
          data.details
        )
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError('Network error', 0, 'NETWORK_ERROR')
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

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/login', credentials)
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data!
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>('/auth/register', userData)
    if (response.success && response.data?.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data!
  }

  async logout(): Promise<void> {
    try {
      await this.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
    }
  }

  async getProfile(): Promise<AuthUser> {
    const response = await this.get<AuthUser>('/auth/profile')
    return response.data!
  }

  async updateProfile(profileData: UpdateProfileData): Promise<AuthUser> {
    const response = await this.put<AuthUser>('/auth/profile', profileData)
    return response.data!
  }

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    await this.put('/auth/change-password', passwordData)
  }

  // User management (Admin only)
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
    const response = await this.put<AuthUser>(`/users/${id}`, { role })
    return response.data!
  }

  async updateUserStatus(id: string, status: AccountStatus): Promise<AuthUser> {
    const response = await this.put<AuthUser>(`/users/${id}/status`, { status })
    return response.data!
  }

  async deleteUser(id: string): Promise<void> {
    await this.delete(`/users/${id}`)
  }

  // Course methods
  async getCourses(filters?: CourseFilters): Promise<PaginatedResponse<CourseWithRelations[]>> {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
    return this.get<PaginatedResponse<CourseWithRelations[]>>(`/courses${queryString}`)
  }

  async getPublicCourses(filters?: Omit<CourseFilters, 'status' | 'isPublished'>) {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
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
    const response = await this.post<CourseWithRelations>('/courses', courseData)
    return response.data!
  }

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<CourseWithRelations> {
    const response = await this.put<CourseWithRelations>(`/courses/${id}`, courseData)
    return response.data!
  }

  async deleteCourse(id: string): Promise<void> {
    await this.delete(`/courses/${id}`)
  }

  async enrollInCourse(courseId: string): Promise<any> {
    const response = await this.post(`/courses/${courseId}/enroll`)
    return response.data!
  }

  async updateLessonProgress(data: {
    lessonId: string
    isCompleted?: boolean
    watchedDuration?: number
    lastPosition?: number
  }): Promise<any> {
    const response = await this.put('/courses/progress', data)
    return response.data!
  }

  async getUserEnrollments(): Promise<any[]> {
    const response = await this.get<any[]>('/courses/enrollments/my')
    return response.data!
  }

  // Article methods
  async getArticles(filters?: ArticleFilters): Promise<PaginatedResponse<ArticleWithRelations[]>> {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
    return this.get<PaginatedResponse<ArticleWithRelations[]>>(`/articles${queryString}`)
  }

  async getPublicArticles(filters?: Omit<ArticleFilters, 'status'>) {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
    return this.get<PaginatedResponse<ArticleWithRelations[]>>(`/articles/public${queryString}`)
  }

  async getArticleById(id: string): Promise<ArticleWithRelations> {
    const response = await this.get<ArticleWithRelations>(`/articles/${id}`)
    return response.data!
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithRelations> {
    const response = await this.get<ArticleWithRelations>(`/articles/slug/${slug}`)
    return response.data!
  }

  async createArticle(articleData: CreateArticleData): Promise<ArticleWithRelations> {
    const response = await this.post<ArticleWithRelations>('/articles', articleData)
    return response.data!
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

  // Book methods
  async getBooks(filters?: BookFilters): Promise<PaginatedResponse<BookWithRelations[]>> {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
    return this.get<PaginatedResponse<BookWithRelations[]>>(`/books${queryString}`)
  }

  async getPublicBooks(filters?: Omit<BookFilters, 'status'>) {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
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

  // Question & Answer methods
  async getQuestions(filters?: QuestionFilters): Promise<PaginatedResponse<QuestionWithRelations[]>> {
    const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ''
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

  // Bookmark methods
  async getBookmarks(filters?: BookmarkFilters): Promise<BookmarkWithRelations[]> {
    const queryString = filters?.type ? `?type=${filters.type}` : ''
    const response = await this.get<BookmarkWithRelations[]>(`/bookmarks${queryString}`)
    return response.data!
  }

  async createBookmark(bookmarkData: CreateBookmarkData): Promise<BookmarkWithRelations> {
    const response = await this.post<BookmarkWithRelations>('/bookmarks', bookmarkData)
    return response.data!
  }

  async checkBookmark(data: Omit<CreateBookmarkData, 'userId'>): Promise<{ isBookmarked: boolean }> {
    const queryString = `?${new URLSearchParams(data as any).toString()}`
    const response = await this.get<{ isBookmarked: boolean }>(`/bookmarks/check${queryString}`)
    return response.data!
  }

  async deleteBookmark(bookmarkId: string): Promise<void> {
    await this.delete(`/bookmarks/${bookmarkId}`)
  }

  async deleteBookmarkByResource(data: Omit<CreateBookmarkData, 'userId'>): Promise<void> {
    await this.delete('/bookmarks/resource', data)
  }

  async getBookmarkCount(data: Omit<CreateBookmarkData, 'userId' | 'type'>): Promise<{ count: number }> {
    const queryString = `?${new URLSearchParams(data as any).toString()}`
    const response = await this.get<{ count: number }>(`/bookmarks/count${queryString}`)
    return response.data!
  }

  // Utility methods
  async uploadFile(file: File): Promise<{ url: string; filename: string; size: number; mimetype: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('token')
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
    const queryString = `?q=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`
    const response = await this.get(`/search${queryString}`)
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

  // Token management
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getToken() !== null
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Export error class
export { ApiError }