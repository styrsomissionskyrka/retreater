import { Prisma } from '@prisma/client';
import { Factory } from 'fishery';
import * as faker from 'faker';

import { LegacyRetreatStatusEnum } from '../graphql';

export const RetreatFactory = Factory.define<Prisma.RetreatCreateInput>(() => {
  let title = faker.lorem.words(4);
  let slug = faker.helpers.slugify(title);
  let createdAt = faker.date.recent(365);

  let startDate = faker.date.soon(faker.datatype.number(180), createdAt);
  let endDate = faker.date.soon(4, startDate);

  let status = faker.random.arrayElement(Object.values(LegacyRetreatStatusEnum));

  return { title, slug, startDate, endDate, createdAt, status };
});
