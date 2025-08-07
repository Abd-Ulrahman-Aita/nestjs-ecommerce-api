import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Check if admin exists
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!admin) {
    // Upsert Super Admin
    admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        is_verified: true,
      },
    });
    console.log('👤 Admin created');
  } else {
    console.log('👤 Admin already exists');
  }

  // Seed products with upsert to avoid duplicate key errors
  const products = [
    {
      name: 'Product 1',
      description: 'Description for product 1',
      price: 100,
      stock: 50,
      sku: 'SKU-001',
    },
    {
      name: 'Product 2',
      description: 'Description for product 2',
      price: 200,
      stock: 30,
      sku: 'SKU-002',
    },
  ];

  for (const product of products) {
    const exists = await prisma.product.findUnique({
      where: { sku: product.sku },
    });

    if (!exists) {
      await prisma.product.create({
        data: {
          ...product,
          owner_id: admin.id,
        },
      });
      console.log(`✅  Product "${product.name}" created`);
    } else {
      console.log(`ℹ️  Product with SKU "${product.sku}" already exists`);
    }
  }

  console.log('✅ Seeding completed.');
  process.exit(0);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());