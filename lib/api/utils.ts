import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import * as z from 'zod';

const allowedMethods = ['get', 'post', 'put', 'patch', 'delete'] as const;
type AllowedMethod = typeof allowedMethods[number];

function isAllowedMethod(method: unknown): method is AllowedMethod {
  return allowedMethods.includes(method as any);
}

type MethodConfig<R> = Record<AllowedMethod, NextApiHandler<R>>;

export function methods<R>(config: MethodConfig<R>): NextApiHandler<R> {
  let allowHeader = Object.keys(config)
    .map((m) => m.toUpperCase())
    .join(', ');

  return async (req, res) => {
    let method = req.method?.toLowerCase();

    if (isAllowedMethod(method) && method in config) {
      await config[method](req, res);
    } else {
      res.setHeader('Allow', allowHeader);
      res.status(405).end('Method Not Allowed');
    }
  };
}

type BaseQuery = Record<string, string | string[]>;

interface NextApiRequestWithQuery<Query extends BaseQuery>
  extends NextApiRequest {
  query: Query;
}

type NextApiHandlerWithQuery<Query extends BaseQuery, Response> = (
  req: NextApiRequestWithQuery<Query>,
  res: NextApiResponse<Response>,
) => void | Promise<void>;

function assertValidQuery<Query extends BaseQuery>(
  req: NextApiRequest,
  schema: z.ZodSchema<Query>,
): asserts req is NextApiRequestWithQuery<Query> {
  schema.parse(req.query);
}

export function parseQuery<Query extends BaseQuery, Response>(
  schema: z.ZodSchema<Query>,
  handler: NextApiHandlerWithQuery<Query, Response>,
): NextApiHandler {
  return async (req, res) => {
    try {
      assertValidQuery(req, schema);
      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid query provided to endpoint',
          errors: error.flatten(),
        });
      } else {
        throw error;
      }
    }
  };
}

type BaseBody = Record<string, unknown>;

interface NextApiRequestWithBody<Body extends BaseBody> extends NextApiRequest {
  body: Body;
}

type NextApiHandlerWithBody<Body extends BaseBody, Response> = (
  req: NextApiRequestWithBody<Body>,
  res: NextApiResponse<Response>,
) => void | Promise<void>;

function assertValidBody<Body extends BaseBody>(
  req: NextApiRequest,
  schema: z.ZodSchema<Body>,
): asserts req is NextApiRequestWithBody<Body> {
  schema.parse(req.body);
}

export function parseBody<Body extends BaseBody, Response>(
  schema: z.ZodSchema<Body>,
  handler: NextApiHandlerWithBody<Body, Response>,
): NextApiHandler {
  return async (req, res) => {
    try {
      assertValidBody(req, schema);
      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid body provided to endpoint',
          errors: error.flatten(),
        });
      } else {
        throw error;
      }
    }
  };
}

interface ParsedNextApiRequest<Query extends BaseQuery, Body extends BaseBody>
  extends NextApiRequest {
  query: Query;
  body: Body;
}

type ParsedNextApiHandler<
  Query extends BaseQuery,
  Body extends BaseBody,
  Response,
> = (
  req: ParsedNextApiRequest<Query, Body>,
  res: NextApiResponse<Response>,
) => void | Promise<void>;

export function parseRequest<
  Query extends BaseQuery,
  Body extends BaseBody,
  Response,
>(
  schemas: { query: z.ZodSchema<Query>; body: z.ZodSchema<Body> },
  handler: ParsedNextApiHandler<Query, Body, Response>,
): NextApiHandler {
  return async (req, res) => {
    try {
      assertValidBody(req, schemas.body);
      assertValidQuery(req, schemas.query);
      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          message: 'Invalid data provided to endpoint',
          errors: error.flatten(),
        });
      } else {
        throw error;
      }
    }
  };
}
