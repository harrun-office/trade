import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/users.routes';
import productRoutes from './modules/products/products.routes';
import adminRoutes from './modules/admin/admin.products.routes';

// Load environment variables
dotenv.config();

console.log('🚀 Starting Trade2Help API server...');
console.log('📝 Database URL:', process.env.DATABASE_URL?.replace(/:([^:@]{4})[^:@]*@/, ':****@'));

const app = express();

// Create a PostgreSQL connection pool (EXACTLY like test-db.ts)
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Create the Prisma Client with the adapter (EXACTLY like test-db.ts)
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log('✅ Prisma client created successfully with adapter');

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// Basic health check

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Trade2Help API is running' });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Prisma client type:', typeof prisma);
    console.log('Prisma client has adapter:', !!(prisma as any)._engine?.adapter);

    // Test connection
    await prisma.$connect();
    console.log('✅ Prisma connect successful');

    // Test with a simple query
    const result = await prisma.user.count();
    console.log('✅ Query successful, user count:', result);

    res.json({
      status: 'OK',
      message: 'Database connection successful',
      userCount: result,
      databaseUrl: process.env.DATABASE_URL?.replace(/:([^:@]{4})[^:@]*@/, ':****@'), // Hide password
      hasAdapter: !!(prisma as any)._engine?.adapter
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// Basic user routes (placeholder)
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_verified: true,
        created_at: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Trade2Help API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test-db`);
  console.log(`📦 Routes registered:`, app._router?.stack?.length || 'unknown');
  console.log(`📝 Database URL: ${process.env.DATABASE_URL}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});
