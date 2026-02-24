import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean
}

// Database configuration:
// - Production (Vercel): Use DATABASE_URL from environment (PostgreSQL - Neon.tech)
// - Local development: Use SQLite file
const getDatabaseUrl = () => {
  // Production: Use DATABASE_URL from environment (PostgreSQL)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }
  
  // Local fallback: SQLite
  return 'file:./dev.db'
}

// Create Prisma client
const createPrismaClient = () => {
  const dbUrl = getDatabaseUrl()
  console.log('[DB] Using database:', dbUrl.includes('postgresql') ? 'PostgreSQL' : 'SQLite')
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasourceUrl: dbUrl,
  })
}

// Export database client
export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Initialize database with default data
export async function initializeDatabase() {
  // Prevent multiple initializations
  if (globalForPrisma.dbInitialized) {
    return
  }
  
  try {
    console.log('[DB] Checking database initialization...')
    
    // Check if admin exists
    const adminCount = await db.adminUser.count()
    
    if (adminCount === 0) {
      console.log('[DB] No admin found, creating default admin...')
      
      // Create default admin
      await db.adminUser.create({
        data: {
          username: 'admin',
          password: 'admin123',
          name: 'Pak RT',
          role: 'Super Admin'
        }
      })
      console.log('[DB] Default admin created: admin/admin123')
    }
    
    // Check RT config
    const configCount = await db.rTConfig.count()
    
    if (configCount === 0) {
      console.log('[DB] Creating default RT config...')
      await db.rTConfig.create({
        data: {
          id: 'default',
          rtName: 'Pak RT',
          rtWhatsapp: '628123456789',
          rtEmail: 'rt03@smartwarga.id',
          appName: 'SmartWarga RT 03',
          appLogo: ''
        }
      })
      console.log('[DB] Default RT config created')
    }
    
    globalForPrisma.dbInitialized = true
    console.log('[DB] Database initialized successfully')
  } catch (error) {
    console.error('[DB] Initialization error:', error)
    // Don't throw, allow app to continue
  }
}
