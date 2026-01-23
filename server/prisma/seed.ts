import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Initialize Prisma client with adapter (same as server.ts)
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5433/trade2help?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  console.log('📂 Creating categories...');
  const electronicsCategory = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Computers, phones, and electronic devices',
    },
  });

  const furnitureCategory = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: {
      name: 'Furniture',
      description: 'Home and office furniture',
    },
  });

  const clothingCategory = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      description: 'Clothes, shoes, and accessories',
    },
  });

  // Create charities
  console.log('🤝 Creating charities...');
  const educationCharity = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440001' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Education for All',
      description: 'Providing educational resources to underprivileged children',
      website: 'https://educationforall.org',
    },
  });

  const environmentCharity = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440002',
      name: 'Green Earth Initiative',
      description: 'Environmental conservation and climate action',
      website: 'https://greenearth.org',
    },
  });

  const healthCharity = await prisma.charity.upsert({
    where: { id: '660e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '660e8400-e29b-41d4-a716-446655440003',
      name: 'Health First',
      description: 'Healthcare access for communities in need',
      website: 'https://healthfirst.org',
    },
  });

  // Create a test user (seller)
  console.log('👤 Creating test user...');
  const testUser = await prisma.user.upsert({
    where: { email: 'seller@example.com' },
    update: {},
    create: {
      email: 'seller@example.com',
      username: 'techseller',
      password_hash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ahfOkK1H5rO8Qz3y', // "password123"
      role: 'user',
      is_verified: true,
    },
  });

  // Create sample products
  console.log('📦 Creating sample products...');

  // Product 1: MacBook Pro
  const macbook = await prisma.product.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440001' }, // Fixed UUID for seeding
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'MacBook Pro 2023 M2',
      description: 'Excellent condition MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Perfect for professionals and students. Includes original charger and box.',
      price: 1899.99,
      condition: 'used',
      status: 'active',
      seller_id: testUser.id,
      category_id: electronicsCategory.id,
      charity_id: educationCharity.id,
      donation_percent: 10.00,
      product_images: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
          {
            image_url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 1,
          },
        ],
      },
    },
  });

  // Product 2: Leather Sofa
  const sofa = await prisma.product.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440002' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'Vintage Leather Sofa',
      description: 'Beautiful vintage leather sofa in excellent condition. Comfortable and stylish, perfect for any living room. 3-seater with genuine leather upholstery.',
      price: 450.00,
      condition: 'used',
      status: 'active',
      seller_id: testUser.id,
      category_id: furnitureCategory.id,
      charity_id: environmentCharity.id,
      donation_percent: 15.00,
      product_images: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  // Product 3: Designer Winter Coat
  const coat = await prisma.product.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440003' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Designer Winter Coat',
      description: 'Stylish designer winter coat, size M. Warm and fashionable, perfect for cold weather. Water-resistant with down filling.',
      price: 120.00,
      condition: 'used',
      status: 'active',
      seller_id: testUser.id,
      category_id: clothingCategory.id,
      charity_id: healthCharity.id,
      donation_percent: 20.00,
      product_images: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  // Product 4: Gaming Setup
  const gamingSetup = await prisma.product.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440004' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'Complete Gaming Setup',
      description: 'Complete gaming setup with high-end PC, 27" monitor, mechanical keyboard, and gaming mouse. Ready to game with RGB lighting and premium components.',
      price: 1200.00,
      condition: 'used',
      status: 'active',
      seller_id: testUser.id,
      category_id: electronicsCategory.id,
      charity_id: educationCharity.id,
      donation_percent: 8.00,
      product_images: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  // Product 5: Acoustic Guitar
  const guitar = await prisma.product.upsert({
    where: { id: '550e8400-e29b-41d4-a716-446655440005' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'Acoustic Guitar',
      description: 'Beautiful acoustic guitar in great condition. Perfect for beginners and experienced players. Steel strings with spruce top and mahogany back.',
      price: 280.00,
      condition: 'used',
      status: 'active',
      seller_id: testUser.id,
      category_id: furnitureCategory.id, // Using furniture as closest category
      charity_id: educationCharity.id,
      donation_percent: 18.00,
      product_images: {
        create: [
          {
            image_url: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800',
            position: 0,
          },
        ],
      },
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log('📊 Created data:');
  console.log(`   - ${await prisma.category.count()} categories`);
  console.log(`   - ${await prisma.charity.count()} charities`);
  console.log(`   - ${await prisma.user.count()} users`);
  console.log(`   - ${await prisma.product.count()} products`);
  console.log(`   - ${await prisma.productImage.count()} product images`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
