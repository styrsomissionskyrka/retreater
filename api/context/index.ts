import { getSession, Claims } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

import { createLogger, Logger } from '../logs';
import { prisma } from './prisma';
import { stripe } from './stripe';
import { Auth0Client } from './auth0';

export const createContext: ContextFunction<ContextArgs, Context> = async (args) => {
  let session = getSession(args.req, args.res);
  return {
    user: session?.user,
    prisma,
    stripe,
    auth0: new Auth0Client(session?.accessToken),
    log: createLogger(prisma),
  };
};

type ContextArgs = {
  req: NextApiRequest | GetServerSidePropsContext['req'];
  res: NextApiResponse | GetServerSidePropsContext['res'];
};

export type Context = {
  user?: Claims;
  prisma: PrismaClient;
  stripe: Stripe;
  auth0: Auth0Client;
  log: Logger;
};
