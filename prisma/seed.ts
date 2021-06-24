import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Start seeding...');
    await prisma.retreat.deleteMany();
    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
