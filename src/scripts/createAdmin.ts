import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = 'admin@lms.com'
  const password = 'admin123'
  const name = 'System Admin'

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()