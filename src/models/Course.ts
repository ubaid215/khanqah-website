// src/models/Course.ts
import { prisma } from "@/lib/prisma";
import {
  Course,
  CourseLevel,
  CourseStatus,
  Module,
  Lesson,
  LessonType, // Added missing import
  Enrollment,
  LessonProgress,
  Certificate,
  Category,
  Prisma,
} from "@prisma/client";

export interface CreateCourseData {
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  thumbnail?: string;
  level?: CourseLevel;
  price?: Prisma.Decimal | number;
  isFree?: boolean;
  categoryIds?: string[];
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  shortDesc?: string;
  thumbnail?: string;
  level?: CourseLevel;
  status?: CourseStatus;
  price?: Prisma.Decimal | number;
  isFree?: boolean;
  isPublished?: boolean;
  publishedAt?: Date | null;
}

export interface CreateModuleData {
  courseId: string;
  title: string;
  description?: string;
  order: number;
}

export interface CreateLessonData {
  moduleId: string;
  title: string;
  description?: string;
  type?: LessonType;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  isFree?: boolean;
}

export type CourseWithRelations = Course & {
  categories: { category: Category }[];
  modules: (Module & { lessons: Lesson[] })[];
  _count?: {
    enrollments: number;
    modules: number;
    lessons: number;
  };
};

export class CourseModel {
  // Course methods
  static async create(data: CreateCourseData): Promise<CourseWithRelations> {
    const { categoryIds, ...courseData } = data;

    return await prisma.course.create({
      data: {
        ...courseData,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async getAllCourses(options: {
    status?: CourseStatus | null;
    level?: CourseLevel | null;
    page?: number;
    limit?: number;
  }) {
    const { status, level, page = 1, limit = 100 } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (level) {
      where.level = level;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          modules: {
            include: {
              lessons: {
                orderBy: {
                  order: "asc",
                },
              },
            },
            orderBy: {
              order: "asc",
            },
          },
          _count: {
            select: {
              enrollments: true,
              modules: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    // Calculate total lessons for each course
    const coursesWithLessonCount = courses.map((course) => {
      const totalLessons = course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );

      return {
        ...course,
        _count: {
          ...course._count,
          lessons: totalLessons,
        },
      };
    });

    return {
      courses: coursesWithLessonCount,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async findById(id: string): Promise<CourseWithRelations | null> {
    if (!id) {
      throw new Error('Course ID is required');
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { 
            lessons: {
              orderBy: { order: "asc" }
            } 
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Calculate counts manually to avoid complex nested where clauses
    const [enrollmentsCount, modulesCount, lessonsCount] = await Promise.all([
      prisma.enrollment.count({ where: { courseId: id } }),
      prisma.module.count({ where: { courseId: id } }),
      prisma.lesson.count({ 
        where: { module: { courseId: id } } 
      }),
    ]);

    return {
      ...course,
      _count: {
        enrollments: enrollmentsCount,
        modules: modulesCount,
        lessons: lessonsCount,
      },
    };
  }

  static async findBySlug(slug: string): Promise<CourseWithRelations | null> {
    if (!slug) {
      throw new Error('Course slug is required');
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { 
            lessons: {
              orderBy: { order: "asc" }
            } 
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return null;
    }

    // Calculate counts manually
    const [enrollmentsCount, modulesCount, lessonsCount] = await Promise.all([
      prisma.enrollment.count({ where: { courseId: course.id } }),
      prisma.module.count({ where: { courseId: course.id } }),
      prisma.lesson.count({ 
        where: { module: { courseId: course.id } } 
      }),
    ]);

    return {
      ...course,
      _count: {
        enrollments: enrollmentsCount,
        modules: modulesCount,
        lessons: lessonsCount,
      },
    };
  }

  static async updateCourse(
    id: string,
    data: UpdateCourseData
  ): Promise<CourseWithRelations> {
    return await prisma.course.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.isPublished ? new Date() : data.publishedAt,
      },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async deleteCourse(id: string): Promise<Course> {
    return await prisma.course.delete({
      where: { id },
    });
  }

  // REMOVED DUPLICATE METHOD - Using this single implementation:
  static async getPublishedCourses(options?: {
    categorySlug?: string;
    level?: CourseLevel;
    page?: number;
    limit?: number;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      isPublished: true,
      status: CourseStatus.PUBLISHED,
      ...(options?.level && { level: options.level }),
      ...(options?.categorySlug && {
        categories: {
          some: {
            category: {
              slug: options.categorySlug,
            },
          },
        },
      }),
    };

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          categories: {
            include: { category: true },
          },
          modules: {
            include: {
              lessons: {
                orderBy: { order: "asc" }
              }
            },
            orderBy: { order: "asc" },
          },
          _count: {
            select: {
              enrollments: true,
              modules: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.course.count({ where }),
    ]);

    // Calculate lesson counts for each course
    const coursesWithLessonCount = courses.map((course) => {
      const totalLessons = course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0
      );

      return {
        ...course,
        _count: {
          ...course._count,
          lessons: totalLessons,
        },
      };
    });

    return {
      courses: coursesWithLessonCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Module methods
  static async createModule(data: CreateModuleData): Promise<Module> {
    return await prisma.module.create({
      data,
    });
  }

  static async updateModule(
    id: string,
    data: Partial<CreateModuleData>
  ): Promise<Module> {
    return await prisma.module.update({
      where: { id },
      data,
    });
  }

  static async deleteModule(id: string): Promise<void> {
    await prisma.module.delete({
      where: { id },
    });
  }

  // Lesson methods
  static async createLesson(data: CreateLessonData): Promise<Lesson> {
    return await prisma.lesson.create({
      data,
    });
  }

  static async updateLesson(
    id: string,
    data: Partial<CreateLessonData>
  ): Promise<Lesson> {
    return await prisma.lesson.update({
      where: { id },
      data,
    });
  }

  static async deleteLesson(id: string): Promise<void> {
    await prisma.lesson.delete({
      where: { id },
    });
  }

  // Enrollment methods
  static async enrollUser(
    courseId: string,
    userId: string
  ): Promise<Enrollment> {
    return await prisma.enrollment.create({
      data: {
        courseId,
        userId,
      },
    });
  }

  static async getUserEnrollment(
    courseId: string,
    userId: string
  ): Promise<Enrollment | null> {
    return await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  static async updateEnrollmentProgress(
    enrollmentId: string,
    progress: number
  ): Promise<Enrollment> {
    return await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        ...(progress === 100
          ? { completedAt: new Date(), status: "COMPLETED" }
          : {}),
      },
    });
  }

  // Progress tracking
  static async updateLessonProgress(data: {
    userId: string;
    lessonId: string;
    isCompleted?: boolean;
    watchedDuration?: number;
    lastPosition?: number;
  }): Promise<LessonProgress> {
    return await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: data.userId,
          lessonId: data.lessonId,
        },
      },
      update: {
        ...(data.isCompleted !== undefined && {
          isCompleted: data.isCompleted,
          ...(data.isCompleted && { completedAt: new Date() }),
        }),
        ...(data.watchedDuration !== undefined && {
          watchedDuration: data.watchedDuration,
        }),
        ...(data.lastPosition !== undefined && {
          lastPosition: data.lastPosition,
        }),
      },
      create: {
        userId: data.userId,
        lessonId: data.lessonId,
        isCompleted: data.isCompleted || false,
        watchedDuration: data.watchedDuration || 0,
        lastPosition: data.lastPosition || 0,
        ...(data.isCompleted && { completedAt: new Date() }),
      },
    });
  }

  // Certificate methods
  static async createCertificate(data: {
    userId: string;
    courseId: string;
    courseTitle: string;
    pdfUrl?: string;
  }): Promise<Certificate> {
    return await prisma.certificate.create({
      data,
    });
  }

  static async getUserCertificates(userId: string): Promise<Certificate[]> {
    return await prisma.certificate.findMany({
      where: { userId },
      orderBy: { issueDate: "desc" },
    });
  }

  // Utility methods
  static async publishCourse(id: string): Promise<CourseWithRelations> {
    return await prisma.course.update({
      where: { id },
      data: {
        isPublished: true,
        status: CourseStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }

  static async unpublishCourse(id: string): Promise<CourseWithRelations> {
    return await prisma.course.update({
      where: { id },
      data: {
        isPublished: false,
        status: CourseStatus.DRAFT,
      },
      include: {
        categories: {
          include: { category: true },
        },
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });
  }
}