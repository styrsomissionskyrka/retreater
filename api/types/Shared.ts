import { scalarType, enumType, objectType, interfaceType, nonNull } from 'nexus';
import { Kind } from 'graphql';

let refDate = new Date('1990-01-01').getTime();

export const DateScalar = scalarType({
  name: 'Date',
  asNexusMethod: 'date',
  sourceType: 'Date',
  description:
    'The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch.',
  parseValue(value) {
    if (value === null) {
      return null;
    }

    try {
      return new Date(value);
    } catch (err) {
      return null;
    }
  },
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime();
    } else if (typeof value === 'number') {
      /**
       * Stripe sends timestamps in seconds since 1970-01-01. We cater for that
       * by checking _if_ the given number is less than ms between 1970-01-01
       * and 1990-01-01. If it's less than that we assume it's a timestamp in
       * seconds since 1970-01-01. It might be unsafe for a while. But as long
       * as we wont back-date stuff to before 1990-01-01 this hold true until
       * 21970-05-30 🤷‍♂️.
       */
      return value < refDate ? Math.trunc(value * 1000) : Math.trunc(value);
    } else if (typeof value === 'string') {
      return Date.parse(value);
    }

    return null;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      const num = parseInt(ast.value, 10);
      return new Date(num);
    } else if (ast.kind === Kind.STRING) {
      return this.serialize!(ast.value);
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
    return null;
  },
  definition(t) {
    t.field('paginationMeta', { type: nonNull(PaginationMeta) });
  },
});
