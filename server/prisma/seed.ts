import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Initialize Prisma client (same pattern as server.ts)
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:root@localhost:5433/trade2help?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // -----------------------------
  // Categories
  // -----------------------------
  console.log('📂 Creating categories...');
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Computers, phones, and electronic devices',
    },
  });

  const furniture = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: {
      name: 'Furniture',
      description: 'Home and office furniture',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      description: 'Clothes, shoes, and accessories',
    },
  });

  // -----------------------------
  // Charities
  // -----------------------------
  console.log('🤝 Creating charities...');
  const education = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Education for All',
      description: 'Providing educational resources to underprivileged children',
      website: 'https://educationforall.org',
    },
  });

  const environment = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Green Earth Initiative',
      description: 'Environmental conservation and climate action',
      website: 'https://greenearth.org',
    },
  });

  const health = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Health First',
      description: 'Healthcare access for communities in need',
      website: 'https://healthfirst.org',
    },
  });

  // -----------------------------
  // Users
  // -----------------------------
  console.log('👤 Creating users...');

  // Generate password hash for seller
  const sellerPasswordHash = await bcrypt.hash('password123', 12);
  const seller = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {
      password_hash: sellerPasswordHash, // Update password hash if user exists
    },
    create: {
      email: 'seller@example.com',
      username: 'techseller',
      password_hash: sellerPasswordHash,
      role: 'user',
      is_verified: true,
    },
  });

  console.log('🛡️ Creating admin user...');
  // Generate password hash for admin
  const adminPasswordHash = await bcrypt.hash('password123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password_hash: adminPasswordHash, // Update password hash if user exists
    },
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password_hash: adminPasswordHash,
      role: 'admin',
      is_verified: true,
    },
  });

  // -----------------------------
  // Products (ALL PENDING)
  // -----------------------------
  console.log('📦 Creating products (pending)...');

  await prisma.product.create({
    data: {
      title: 'MacBook Pro 2023 M2',
      description:
        'Excellent condition MacBook Pro with M2 chip, 16GB RAM, 512GB SSD.',
      price: 1899.99,
      condition: 'Excellent',
      status: 'pending',
      seller_id: seller.id,
      category_id: electronics.id,
      charity_id: education.id,
      donation_percent: 10,
      product_images: {
        create: [
          {
            image_url:
              'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
          {
            image_url:
              'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 1,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Vintage Leather Sofa',
      description:
        'Beautiful vintage leather sofa in great condition. 3-seater.',
      price: 450,
      condition: 'Good',
      status: 'pending',
      seller_id: seller.id,
      category_id: furniture.id,
      charity_id: environment.id,
      donation_percent: 15,
      product_images: {
        create: [
          {
            image_url:
              'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Designer Winter Coat',
      description:
        'Stylish designer winter coat, size M, warm and fashionable.',
      price: 120,
      condition: 'Good',
      status: 'pending',
      seller_id: seller.id,
      category_id: clothing.id,
      charity_id: health.id,
      donation_percent: 20,
      product_images: {
        create: [
          {
            image_url:
              'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Complete Gaming Setup',
      description:
        'High-end gaming PC with monitor, keyboard, and mouse.',
      price: 1200,
      condition: 'Excellent',
      status: 'pending',
      seller_id: seller.id,
      category_id: electronics.id,
      charity_id: education.id,
      donation_percent: 8,
      product_images: {
        create: [
          {
            image_url:
              'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      title: 'Acoustic Guitar',
      description:
        'Beautiful acoustic guitar, great for beginners and pros.',
      price: 280,
      condition: 'Good',
      status: 'pending',
      seller_id: seller.id,
      category_id: furniture.id,
      charity_id: education.id,
      donation_percent: 18,
      product_images: {
        create: [
          {
            image_url:
              'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log(`📊 Categories: ${await prisma.category.count()}`);
  console.log(`📊 Charities: ${await prisma.charity.count()}`);
  console.log(`📊 Users: ${await prisma.user.count()}`);
  console.log(`📊 Products (pending): ${await prisma.product.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
