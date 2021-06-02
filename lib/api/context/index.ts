import { getSession, Claims } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';
import { NextApiRequest, NextApiResponse } from 'next';
import { AxiosInstance } from 'axios';
import { prisma } from './prisma';
import { auth0 } from '../../utils/auth0';

export const createContext: ContextFunction<ContextArgs, Context> = async (args) => {
  let session = getSession(args.req, args.res);

  return { prisma, user: session?.user, auth0 };
};

interface ContextArgs {
  req: NextApiRequest;
  res: NextApiResponse;
}

export type Context = {
  prisma: PrismaClient;
  user?: Claims;
  auth0: AxiosInstance;
};
