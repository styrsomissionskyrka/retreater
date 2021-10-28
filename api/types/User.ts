import * as n from 'nexus';

export const User = n.objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('email');
    t.string('name');
    t.string('image');
  },
});
