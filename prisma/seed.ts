import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
  {
    name: 'Adam Bergman',
    email: 'adam@fransvilhelm.com',
  },
  {
    name: 'Frans Bergman',
    email: 'frans@fransvilhelm.com',
  },
];

export async function seed() {
  try {
    console.log('Start seeding...');

    await prisma.user.createMany({ data: users, skipDuplicates: true });

    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
