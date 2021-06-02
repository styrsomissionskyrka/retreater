import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  try {
    let users = await prisma.user.findMany();
    console.log(users);
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
