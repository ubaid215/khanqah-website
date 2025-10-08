// src/models/User.ts
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole, AccountStatus, Session, User as PrismaUser } from '@prisma/client'

export interface CreateUserData {
  email: string
  password: string
  username?: string
  name?: string
  image?: string
  bio?: string
  role?: UserRole
}

export interface UpdateUserData {
  name?: string
  image?: string
  bio?: string
  username?: string
  lastLoginAt?: Date
}

export interface LoginData {
  email: string
  password: string
}

export type SafeUser = Omit<PrismaUser, 'password'>

export class UserModel {
  private static readonly SALT_ROUNDS = 12
  
  static async create(data: CreateUserData): Promise<SafeUser> {
    // Check if user already exists
    const existingUser = await this.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Check username uniqueness if provided
    if (data.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username: data.username }
      })
      if (existingUsername) {
        throw new Error('Username already taken')
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS)
    
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || UserRole.USER,
      },
      select: this.getSafeUserSelect()
    })
  }

  static async findByEmail(email: string): Promise<PrismaUser | null> {
    return await prisma.user.findUnique({
      where: { email },
    })
  }

  static async findByUsername(username: string): Promise<SafeUser | null> {
    return await prisma.user.findUnique({
      where: { username },
      select: this.getSafeUserSelect()
    })
  }

  static async findById(id: string): Promise<SafeUser | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: this.getSafeUserSelect()
    })
  }

  static async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<SafeUser> {
    // Check username uniqueness if updating
    if (data.username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id }
        }
      })
      if (existingUsername) {
        throw new Error('Username already taken')
      }
    }

    return await prisma.user.update({
      where: { id },
      data,
      select: this.getSafeUserSelect()
    })
  }

  static async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, this.SALT_ROUNDS)
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })
  }

  static async updateStatus(id: string, status: AccountStatus): Promise<SafeUser> {
    return await prisma.user.update({
      where: { id },
      data: { status },
      select: this.getSafeUserSelect()
    })
  }

  static async updateLastLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() }
    })
  }

  static async getAllAdmins(): Promise<SafeUser[]> {
    return await prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
        }
      },
      select: this.getSafeUserSelect()
    })
  }

  static async deleteUser(id: string): Promise<SafeUser> {
    return await prisma.user.delete({
      where: { id },
      select: this.getSafeUserSelect()
    })
  }

  static async getUserStats() {
    return await prisma.user.groupBy({
      by: ['role', 'status'],
      _count: {
        id: true
      }
    })
  }

  // Session management
  static async createSession(data: {
    userId: string
    token: string
    expiresAt: Date
    ipAddress?: string
    userAgent?: string
  }): Promise<Session> {
    return await prisma.session.create({
      data
    })
  }

  static async findSessionByToken(token: string): Promise<Session | null> {
    return await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })
  }

  static async deleteSession(token: string): Promise<void> {
    await prisma.session.delete({
      where: { token }
    })
  }

  static async deleteAllUserSessions(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId }
    })
  }

  static async cleanupExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }

  private static getSafeUserSelect() {
    return {
      id: true,
      email: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
    }
  }
}