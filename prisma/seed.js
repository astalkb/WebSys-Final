const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Vitamins',
        description: 'Essential vitamins for daily health support',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Supplements',
        description: 'Dietary supplements for specific health needs',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Health Packs',
        description: 'Combination health packs for overall wellness',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty Products',
        description: 'Beauty and skincare products',
      },
    }),
  ]);

  // Create products
  const products = [
    // Vitamins
    {
      name: 'Vitamin C Gold',
      description: 'Premium Vitamin C supplement for immune support',
      price: 599.99,
      images: ['\VIT-BOO-DAL-GLD.jpg'],
      categoryId: categories[0].id,
      stock: 100,
    },
    {
      name: 'Vitamin B Complex',
      description: 'Complete B vitamin complex for energy and metabolism',
      price: 499.99,
      images: ['/VIT-BOO-GUY-PLA.jpg'],
      categoryId: categories[0].id,
      stock: 100,
    },
    {
      name: 'Vitamin D Gold',
      description: 'High-potency Vitamin D for bone health',
      price: 549.99,
      images: ['/VIT-BOO-DAL-GLD.jpg'],
      categoryId: categories[0].id,
      stock: 100,
    },

    // Supplements
    {
      name: 'Herbal Supplement',
      description: 'Natural herbal supplement for overall wellness',
      price: 399.99,
      images: ['/VIT-HER-3N1-SHM.jpg'],
      categoryId: categories[1].id,
      stock: 100,
    },
    {
      name: 'Protein Supplement',
      description: 'High-quality protein supplement for muscle support',
      price: 699.99,
      images: ['/SHM-PAT-ANT-DAN.jpg'],
      categoryId: categories[1].id,
      stock: 100,
    },

    // Health Packs
    {
      name: 'Premium Health Pack',
      description: 'Complete health pack with essential nutrients',
      price: 1299.99,
      images: ['/HPCK-MELON-PREM.jpg'],
      categoryId: categories[2].id,
      stock: 50,
    },
    {
      name: 'Fruit Medley Pack',
      description: 'Nutritious fruit combination pack',
      price: 899.99,
      images: ['/HP-FRUIT-MEDLEY.jpg'],
      categoryId: categories[2].id,
      stock: 50,
    },
    {
      name: 'Fat Away Pack',
      description: 'Weight management support pack',
      price: 799.99,
      images: ['/H-PACK-FAT-AWAY.jpg'],
      categoryId: categories[2].id,
      stock: 50,
    },

    // Beauty Products
    {
      name: 'Lip Tint',
      description: 'Natural lip tint for beautiful lips',
      price: 299.99,
      images: ['/GAB-LIP-TINT-01.jpg'],
      categoryId: categories[3].id,
      stock: 100,
    },
    {
      name: 'Moringa Oil',
      description: 'Pure moringa oil for skin and hair',
      price: 399.99,
      images: ['/DAL-MORINGA-OIL.jpg'],
      categoryId: categories[3].id,
      stock: 100,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
