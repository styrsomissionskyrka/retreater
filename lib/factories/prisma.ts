import { Prisma } from '@prisma/client';
import { Factory } from 'fishery';
import * as faker from 'faker';

export const RetreatFactory = Factory.define<Prisma.RetreatCreateInput>(() => {
  let title = faker.lorem.words(4);
  let slug = faker.helpers.slugify(title);
  let startDate = faker.date.soon(faker.datatype.number(50));
  let endDate = faker.date.soon(4, startDate);

  return { title, slug, startDate, endDate };
});
