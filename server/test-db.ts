import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  // Create a PostgreSQL connection pool
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });

  // Create the Prisma Client with the adapter
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');

    console.log('Testing query...');
    const userCount = await prisma.user.count();
    console.log('✅ Query successful! User count:', userCount);

    console.log('Testing table creation...');
    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password_hash: 'test',
        role: 'user'
      }
    });
    console.log('✅ User created:', testUser);

    // Clean up
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test user cleaned up');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Disconnected from database');
  }
}

testConnection();
