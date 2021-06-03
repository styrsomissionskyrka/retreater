import { getSession, Claims } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './prisma';
import { Auth0Client } from './auth0';

export const createContext: ContextFunction<ContextArgs, Context> = async (args) => {
  let session = getSession(args.req, args.res);
  return { prisma, user: session?.user, auth0: new Auth0Client() };
};

interface ContextArgs {
  req: NextApiRequest;
  res: NextApiResponse;
}

export type Context = {
  prisma: PrismaClient;
  user?: Claims;
  auth0: Auth0Client;
};
