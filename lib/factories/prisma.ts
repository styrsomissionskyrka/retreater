import { Prisma } from '@prisma/client';
import { Factory } from 'fishery';
import * as faker from 'faker';

export const RetreatFactory = Factory.define<Prisma.RetreatCreateInput>(() => {
  let title = faker.lorem.words(4);
  let slug = faker.helpers.slugify(title);
  let createdAt = faker.date.recent(60);
  let startDate = faker.date.soon(faker.datatype.number(20));
  let endDate = faker.date.soon(4, startDate);

  return { title, slug, startDate, endDate, createdAt };
});
