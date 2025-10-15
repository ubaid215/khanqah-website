import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AuthMiddleware, ApiResponse } from '@/controllers/AuthController'
import { UserRole } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    console.log('📚 [Categories API] Fetching all categories')
    
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true
              }
            }
          }
        }
      }
    })

    console.log('✅ [Categories API] Categories fetched successfully:', {
      count: categories.length
    })

    return ApiResponse.success(categories, 'Categories retrieved successfully')
  } catch (error: any) {
    console.error('❌ [Categories API] Error fetching categories:', error)
    return ApiResponse.error('Internal server error')
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await AuthMiddleware.requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])(req)
    if (authResult.error) {
      return ApiResponse.error(authResult.error, 403)
    }

    const { name, slug, description, icon } = await req.json()

    console.log('📝 [Categories API] Creating category:', {
      name,
      slug,
      description,
      icon
    })

    // Validation
    if (!name) {
      return ApiResponse.error('Category name is required', 400)
    }

    // Generate slug if not provided
    const categorySlug = slug || name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { slug: categorySlug }
        ]
      }
    })

    if (existingCategory) {
      return ApiResponse.error('Category with this name or slug already exists', 400)
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        description,
        icon: icon || '📚'
      }
    })

    console.log('✅ [Categories API] Category created successfully:', {
      id: category.id,
      name: category.name,
      slug: category.slug
    })

    return ApiResponse.success(category, 'Category created successfully', 201)
  } catch (error: any) {
    console.error('❌ [Categories API] Error creating category:', error)
    
    if (error.code === 'P2002') {
      return ApiResponse.error('Category with this name or slug already exists', 400)
    }
    
    return ApiResponse.error('Internal server error')
  }
}