import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { createLogger, Logger } from '../logs';
import { prisma } from './prisma';
import { stripe } from './stripe';

export const createContext: ContextFunction<ContextArgs, Context> = async (args) => {
  let session = await getSession(args);
  return {
    session,
    prisma,
    stripe,
    log: createLogger(prisma),
  };
};

type ContextArgs = {
  req: NextApiRequest | GetServerSidePropsContext['req'];
  res: NextApiResponse | GetServerSidePropsContext['res'];
};

export type Context = {
  session: Session | null;
  prisma: PrismaClient;
  stripe: Stripe;
  log: Logger;
};
