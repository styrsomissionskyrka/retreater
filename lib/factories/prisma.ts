import { Prisma } from '@prisma/client';
import { Factory } from 'fishery';
import * as faker from 'faker';

export const RetreatFactory = Factory.define<Prisma.RetreatCreateInput>(() => {
  let title = faker.lorem.words(4);
  let slug = faker.helpers.slugify(title);

  return { title, slug };
});
