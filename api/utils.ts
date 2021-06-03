import { Context } from './context';

const DEFAULT_CURSOR = Buffer.from('cursor:0').toString('base64');

export function extractIndexFromCursor(cursor?: string | null): number {
  let value = Buffer.from(cursor ?? DEFAULT_CURSOR, 'base64').toString();
  let [, indexString] = value.split(':');
  let index = Number(indexString);
  return Number.isNaN(index) ? 0 : index;
}

interface BaseArgs {
  first: number;
  after?: string | null | undefined;
}

export function createPageInfoFromNodes<Args extends BaseArgs>(
  getTotalItems: (ctx: Context, args: Args) => Promise<number>,
) {
  return async (_: unknown[], args: Args, ctx: Context) => {
    let skip = extractIndexFromCursor(args.after);
    let total = args.first + skip;
    let totalItems = await getTotalItems(ctx, args);

    return {
      hasNextPage: totalItems > total,
      hasPreviousPage: skip > 0,
    };
  };
}

export function clearUndefined<O extends Record<string, unknown>>(object: O): RequiredFields<O> {
  let proxy: Record<string, any> = {};

  for (let key of Object.keys(object)) {
    let v = object[key];
    if (typeof v !== 'undefined') {
      proxy[key] = v;
    }
  }

  return proxy as RequiredFields<O>;
}

type RequiredFields<P> = {
  [K in keyof P]-?: NonNullable<P[K]>;
};
