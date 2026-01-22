import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Check if it's an HTTP URL
const dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.startsWith('prisma+postgres://')) {
  console.log('❌ DATABASE_URL is still using Prisma dev URL format');
} else if (dbUrl.startsWith('postgresql://')) {
  console.log('✅ DATABASE_URL is using direct PostgreSQL connection');
} else {
  console.log('❓ DATABASE_URL format unknown:', dbUrl.substring(0, 20) + '...');
}
