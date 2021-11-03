import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { ManagementClient } from 'auth0';

import { createLogger, Logger } from '../logs';
import { prisma } from './prisma';
import { stripe } from './stripe';
import { createAuth0Client } from './auth0';
import { App } from './app';
import { MailService } from './mail';

type ContextArgs = {
  req: NextApiRequest | GetServerSidePropsContext['req'];
  res: NextApiResponse | GetServerSidePropsContext['res'];
};

export type Context = {
  app: App;
  session: Session | null;
  prisma: PrismaClient;
  stripe: Stripe;
  log: Logger;
  auth0: ManagementClient;
  mail: MailService;
};

const ContextCache = new Map<string, Promise<Context>>();

export const createContext: ContextFunction<ContextArgs, Context> = async (args) => {
  let session = await getSession(args);

  let cacheKey = createCacheKey(session);
  let cached = ContextCache.get(cacheKey);
  if (cached != null) {
    return cached;
  }

  let context = createContextInternal(session);
  ContextCache.set(cacheKey, context);
  return context;
};

async function createContextInternal(session: Session | null): Promise<Context> {
  let app = await App.create(prisma);
  let auth0 = await createAuth0Client(app);
  let mail = new MailService();

  return {
    app,
    session,
    prisma,
    stripe,
    log: createLogger(prisma),
    auth0,
    mail,
  };
}

function createCacheKey(session?: Session | null) {
  if (session == null) return '';
  return session.user.id ?? '';
}
