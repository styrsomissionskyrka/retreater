import { PrismaClient } from '@prisma/client';
import { RetreatFactory } from '../lib/factories/prisma';

const prisma = new PrismaClient();

const retreats = RetreatFactory.buildList(5);

(async () => {
  try {
    console.log('Start seeding...');

    await prisma.retreat.deleteMany();

    for (let data of retreats) {
      if ((await prisma.retreat.count({ where: { slug: data.slug } })) < 1) {
        let retreat = await prisma.retreat.create({ data });
        console.log(`Created retreat with id ${retreat.id}`);
      }
    }

    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
