// src/scripts/createAdmin.ts
import { PrismaClient, UserRole, AccountStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  // Default credentials (edit these as you wish)
  const email = process.env.ADMIN_EMAIL || 'admin@khanqahsaifia.com'
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'
  const name = process.env.ADMIN_NAME || 'System Administrator'

  try {
    console.log('')
    console.log('🚀 ═══════════════════════════════════════════════════')
    console.log('🚀 Admin User Creation Script (Auto Mode)')
    console.log('🚀 ═══════════════════════════════════════════════════')
    console.log('')

    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('💾 Creating or updating admin user...')

    // Use upsert to create or update the admin
    const admin = await prisma.user.upsert({
      where: { email: email.trim() },
      update: {},
      create: {
        email: email.trim(),
        username: username.trim(),
        password: hashedPassword,
        name,
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
    console.log(`📧 Email:     ${admin.email}`)
    console.log(`👤 Username:  ${admin.username || 'N/A'}`)
    console.log(`👤 Name:      ${admin.name || 'N/A'}`)
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
      console.error('💡 This email or username is already registered in the database')
    } else if (error.message.includes('Can\'t reach database server')) {
      console.error('💡 Database connection issue: check your DATABASE_URL')
    } else if (error.message.includes('does not exist')) {
      console.error('💡 Database schema mismatch detected.')
      console.error('   Run: npx prisma db pull')
      console.error('   Then: npx prisma generate')
    }

    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()