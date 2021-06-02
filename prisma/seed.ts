import { PrismaClient } from '@prisma/client';
import * as faker from 'faker';
import { UserFactory, RetreatFactory } from '../lib/factories/prisma';

const prisma = new PrismaClient();

const users = UserFactory.buildList(10);

const retreats = RetreatFactory.afterBuild((retreat) => {
  let idx = faker.datatype.number(users.length - 1);
  retreat.createdBy = { connect: { email: users[idx].email } };
}).buildList(5);

(async () => {
  try {
    console.log('Start seeding...');

    await prisma.retreat.deleteMany();
    await prisma.user.deleteMany();

    for (let data of users) {
      if ((await prisma.user.count({ where: { email: data.email } })) < 1) {
        let user = await prisma.user.create({ data });
        console.log(`Created user with id ${user.id}`);
      }
    }

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
