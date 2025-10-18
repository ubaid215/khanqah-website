// scripts/createAdmin.ts
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface AdminOptions {
  email: string
  password: string
  name?: string
  username?: string
}

async function createAdmin(options: AdminOptions) {
  const {
    email,
    password,
    name = 'System Administrator',
    username = 'admin'
  } = options

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email) {
        console.log('❌ User with this email already exists')
        console.log(`📧 Email: ${existingUser.email}`)
        console.log(`👤 Role: ${existingUser.role}`)
      } else {
        console.log('❌ User with this username already exists')
        console.log(`👤 Username: ${existingUser.username}`)
      }
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: new Date()
      }
    })

    console.log('🎉 Admin user created successfully!')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Username: ${username}`)
    console.log(`👤 Name: ${name}`)
    console.log(`🆔 User ID: ${admin.id}`)
    console.log(`🎯 Role: ${admin.role}`)
    console.log('✅ Email verified: Yes')
    console.log('')
    console.log('⚠️  Please keep these credentials secure!')
    console.log('⚠️  Consider changing the password after first login!')

  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Get credentials from command line arguments or environment variables
function getCredentials(): AdminOptions {
  const args = process.argv.slice(2)
  
  let email = ''
  let password = ''
  let name = 'System Administrator'
  let username = 'admin'

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1]
      i++
    } else if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1]
      i++
    } else if (args[i] === '--name' && args[i + 1]) {
      name = args[i + 1]
      i++
    } else if (args[i] === '--username' && args[i + 1]) {
      username = args[i + 1]
      i++
    } else if (args[i].startsWith('--email=')) {
      email = args[i].split('=')[1]
    } else if (args[i].startsWith('--password=')) {
      password = args[i].split('=')[1]
    } else if (args[i].startsWith('--name=')) {
      name = args[i].split('=')[1]
    } else if (args[i].startsWith('--username=')) {
      username = args[i].split('=')[1]
    }
  }

  // Check environment variables if command line args not provided
  if (!email) {
    email = process.env.ADMIN_EMAIL || ''
  }
  if (!password) {
    password = process.env.ADMIN_PASSWORD || ''
  }
  if (!name || name === 'System Administrator') {
    name = process.env.ADMIN_NAME || 'System Administrator'
  }
  if (!username || username === 'admin') {
    username = process.env.ADMIN_USERNAME || 'admin'
  }

  // If still no credentials, use defaults with warning
  if (!email || !password) {
    console.log('🔐 No credentials provided. Using defaults (NOT RECOMMENDED FOR PRODUCTION)')
    console.log('')
    console.log('Usage examples:')
    console.log('  npm run create-admin -- --email=your@email.com --password=yourpassword')
    console.log('  npm run create-admin -- --email your@email.com --password yourpassword')
    console.log('  ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword npm run create-admin')
    console.log('')
    
    if (!email) email = 'admin@lms.com'
    if (!password) password = 'admin123'
    
    console.log(`📧 Using email: ${email}`)
    console.log(`🔑 Using password: ${password}`)
    console.log('')
  }

  return { email, password, name, username }
}

// Main execution
async function main() {
  const credentials = getCredentials()
  await createAdmin(credentials)
}

main()