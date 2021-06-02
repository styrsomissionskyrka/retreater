import { Prisma } from '@prisma/client';
import { Factory } from 'fishery';
import * as faker from 'faker';

export const UserFactory = Factory.define<Prisma.UserCreateInput>(() => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
}));

export const RetreatFactory = Factory.define<Prisma.RetreatCreateInput>(() => {
  let title = faker.lorem.words(4);
  let slug = faker.helpers.slugify(title);

  return {
    title,
    slug,
    createdBy: {
      connect: { email: faker.internet.email() },
    },
  };
});
