import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
// Use default local database URL if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5433/trade2help?schema=public';
const pool = new Pool({ connectionString });

// Create the Prisma Client with the adapter
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
