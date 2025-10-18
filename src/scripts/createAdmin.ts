// src/scripts/createAdmin.ts
import { PrismaClient, UserRole, AccountStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  // Default credentials (edit these as you wish)
  const email = process.env.ADMIN_EMAIL || 'admin@khanqahsaifia.com'
  const password = process.env.ADMIN_PASSWORD || 'Admin1234'
  const name = process.env.ADMIN_NAME || 'System Administrator'

  try {
    console.log('')
    console.log('🚀 ═══════════════════════════════════════════════════')
    console.log('🚀 Admin User Creation Script (Auto Mode)')
    console.log('🚀 ═══════════════════════════════════════════════════')
    console.log('')

    console.log('🔍 Checking if admin already exists...')

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim() },
    })

    if (existingUser) {
      console.log('✅ Admin already exists:')
      console.log(`📧 Email: ${existingUser.email}`)
      console.log(`👤 Name:  ${existingUser.name || 'N/A'}`)
      console.log(`🎯 Role:  ${existingUser.role}`)
      console.log('')
      await prisma.$disconnect()
      return
    }

    console.log('✓ No existing admin found')
    console.log('🔐 Hashing password...')

    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('✓ Password hashed')
    console.log('💾 Creating admin user...')

    const admin = await prisma.user.create({
      data: {
        email: email.trim(),
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
      },
    })

    console.log('')
    console.log('🎉 ═══════════════════════════════════════════════════')
    console.log('🎉 Admin User Created Successfully!')
    console.log('🎉 ═══════════════════════════════════════════════════')
    console.log('')
    console.log(`📧 Email:     ${email}`)
    console.log(`👤 Name:      ${name}`)
    console.log(`🆔 User ID:   ${admin.id}`)
    console.log(`🎯 Role:      ${admin.role}`)
    console.log(`📊 Status:    ${admin.status}`)
    console.log('')
    console.log('⚠️  SECURITY NOTE:')
    console.log('   • Change this default password after first login')
    console.log('   • Keep admin credentials safe')
    console.log('')
    console.log('🔗 Login at: https://khanqahsaifia.com/admin/login')
    console.log('')

  } catch (error: any) {
    console.error('')
    console.error('❌ Error Creating Admin User')
    console.error('--------------------------------')
    console.error(`Message: ${error.message}`)
    console.error('')

    if (error.code === 'P2002') {
      console.error('💡 This email is already registered in the database')
    } else if (error.message.includes('Can\'t reach database server')) {
      console.error('💡 Database connection issue: check your DATABASE_URL')
    } else if (error.message.includes('does not exist')) {
      console.error('💡 Run `npx prisma db push` to sync your schema.')
    }

    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
