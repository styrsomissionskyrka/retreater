import { scalarType, enumType, objectType, interfaceType, nonNull } from 'nexus';
import { Kind } from 'graphql';

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  description: 'Date custom scalar type',
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});

export const OrderEnum = enumType({
  name: 'OrderEnum',
  members: { ASC: 'asc', DESC: 'desc' },
});

export const PaginationMeta = objectType({
  name: 'PaginationMeta',
  definition(t) {
    t.nonNull.boolean('hasNextPage');
    t.nonNull.boolean('hasPreviousPage');
    t.nonNull.int('currentPage');
    t.nonNull.int('totalPages');
    t.nonNull.int('perPage');
    t.nonNull.int('totalItems');
  },
});

export const PaginatedQuery = interfaceType({
  name: 'PaginatedQuery',
  resolveType(source) {
    if ('users' in source) return 'PaginatedUser';
    if ('retreats' in source) return 'PaginatedRetreat';
    return null;
  },
  definition(t) {
    t.field('paginationMeta', { type: nonNull(PaginationMeta) });
  },
});
