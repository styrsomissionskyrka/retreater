import {
  arg,
  enumType,
  intArg,
  interfaceType,
  makeSchema,
  objectType,
  queryType,
  stringArg,
  list,
  scalarType,
} from 'nexus';
import { Kind } from 'graphql';

export const Node = interfaceType({
  name: 'Node',
  resolveType(source) {
    return source.__typename;
  },
  definition(t) {
    t.id('id', { description: 'Unique identifier for the resource' });
  },
});
