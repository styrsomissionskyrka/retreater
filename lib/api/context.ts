import { PrismaClient } from '@prisma/client';
import { ContextFunction } from 'apollo-server-core';

interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (global.prisma == null) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export const createContext: ContextFunction<unknown, Context> = async () => {
  return { prisma };
};

export type Context = {
  prisma: PrismaClient;
};
