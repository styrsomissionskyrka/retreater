import * as z from 'zod';

export const id = z.union([z.number().int(), z.string()]).transform((x) => {
  let val = typeof x === 'number' ? x : Number(x);
  if (Number.isNaN(val)) throw new Error('Invalid integer value given');
  return val;
});

export const emptyArrayToObject = z
  .union([z.array(z.any()), z.record(z.string(), z.unknown())])
  .transform((x) => (Array.isArray(x) ? {} : x));

export const apiDate = z.string().transform((x) => (x === '' ? undefined : x));

export const rendered = z.object({
  protected: z.boolean().optional(),
  rendered: z.string(),
});

export const context = z.enum(['view', 'embed', 'edit']);

export const order = z.enum(['asc', 'desc']);

export const operator = z.enum(['AND', 'OR']);
