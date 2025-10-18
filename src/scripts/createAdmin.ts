// src/scripts/createAdmin.ts
import { PrismaClient, UserRole, AccountStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface AdminOptions {
  email: string
  password: string
  name?: string
}

async function createAdmin(options: AdminOptions) {
  const {
    email,
    password,
    name = 'System Administrator'
  } = options

  try {
    console.log('🔍 Validating inputs...')
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Validate password strength (production requirements)
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number')
    }

    console.log('✓ Input validation passed')
    console.log('🔍 Checking if user exists...')

    // FIXED: Use findUnique instead of findFirst with proper where clause
    const existingUser = await prisma.user.findUnique({
      where: { 
        email: email.trim()
      }
    })

    if (existingUser) {
      console.log('❌ User with this email already exists')
      console.log(`📧 Email: ${existingUser.email}`)
      console.log(`👤 Role: ${existingUser.role}`)
      console.log(`👤 Name: ${existingUser.name || 'N/A'}`)
      console.log(`📊 Status: ${existingUser.status}`)
      
      // Ask if they want to upgrade existing user to admin
      console.log('')
      console.log('💡 To upgrade this user to admin role, run:')
      console.log(`   npx prisma studio`)
      console.log(`   Or execute SQL: UPDATE users SET role = 'ADMIN' WHERE email = '${email}';`)
      return
    }

    console.log('✓ Email is available')
    console.log('🔐 Hashing password...')

    // Hash password with bcrypt (12 rounds for production)
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('✓ Password hashed')
    console.log('💾 Creating admin user...')

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: email.trim(),
        name,
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: AccountStatus.ACTIVE,
        emailVerified: new Date(),
        // username is optional in schema, so we don't include it
      }
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
    console.log(`✅ Verified:  ${admin.emailVerified ? 'Yes' : 'No'}`)
    console.log('')
    console.log('⚠️  SECURITY REMINDERS:')
    console.log('   • Store these credentials in a secure password manager')
    console.log('   • Change password after first login')
    console.log('   • Enable 2FA if available')
    console.log('   • Never share admin credentials')
    console.log('')
    console.log('🔗 Login at: https://khanqahsaifia.com/admin/login')
    console.log('')

  } catch (error: any) {
    console.error('')
    console.error('❌ ═══════════════════════════════════════════════════')
    console.error('❌ Error Creating Admin User')
    console.error('❌ ═══════════════════════════════════════════════════')
    console.error('')
    console.error(`Error: ${error.message}`)
    console.error('')
    
    // Provide helpful debugging information
    if (error.code === 'P2002') {
      console.error('💡 This email is already registered in the database')
    } else if (error.code === 'P2003') {
      console.error('💡 Database foreign key constraint error')
    } else if (error.message.includes('does not exist in the current database')) {
      console.error('💡 Database Schema Issue:')
      console.error('   Your database schema is out of sync.')
      console.error('')
      console.error('   Solutions:')
      console.error('   1. Run: npx prisma db push')
      console.error('   2. Or: npx prisma migrate deploy')
      console.error('   3. Or: npx prisma migrate dev --name init')
    } else if (error.message.includes('Can\'t reach database server')) {
      console.error('💡 Database Connection Issue:')
      console.error('   • Check your DATABASE_URL in .env file')
      console.error('   • Verify database is running')
      console.error('   • Check network connectivity')
    }
    
    console.error('')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

function getCredentials(): AdminOptions {
  const args = process.argv.slice(2)
  
  let email = ''
  let password = ''
  let name = 'System Administrator'

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
    } else if (args[i].startsWith('--email=')) {
      email = args[i].split('=')[1]
    } else if (args[i].startsWith('--password=')) {
      password = args[i].split('=')[1]
    } else if (args[i].startsWith('--name=')) {
      name = args[i].split('=')[1]
    }
  }

  // Check environment variables
  if (!email) email = process.env.ADMIN_EMAIL || ''
  if (!password) password = process.env.ADMIN_PASSWORD || ''
  if (!name || name === 'System Administrator') {
    name = process.env.ADMIN_NAME || 'System Administrator'
  }

  // Production mode: require credentials
  if (!email || !password) {
    console.error('')
    console.error('❌ ═══════════════════════════════════════════════════')
    console.error('❌ Admin credentials required!')
    console.error('❌ ═══════════════════════════════════════════════════')
    console.error('')
    console.error('Usage:')
    console.error('')
    console.error('  Method 1: Command line arguments')
    console.error('  npm run create-admin -- --email=admin@example.com --password=SecurePass123')
    console.error('')
    console.error('  Method 2: With name')
    console.error('  npm run create-admin -- --email admin@example.com --password SecurePass123 --name "John Doe"')
    console.error('')
    console.error('  Method 3: Environment variables')
    console.error('  ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=SecurePass123 npm run create-admin')
    console.error('')
    console.error('  Method 4: Interactive mode (recommended)')
    console.error('  npm run create-admin-interactive')
    console.error('')
    console.error('Password Requirements:')
    console.error('  • Minimum 8 characters')
    console.error('  • At least one uppercase letter')
    console.error('  • At least one lowercase letter')
    console.error('  • At least one number')
    console.error('')
    process.exit(1)
  }

  return { email, password, name }
}

async function main() {
  console.log('')
  console.log('🚀 ═══════════════════════════════════════════════════')
  console.log('🚀 Admin User Creation Script')
  console.log('🚀 ═══════════════════════════════════════════════════')
  console.log('')
  
  const credentials = getCredentials()
  await createAdmin(credentials)
}

main()