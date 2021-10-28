import { PrismaClient, ApplicationConfig } from '@prisma/client';

const SYSTEM_ID = 1;

export async function getAppConfig(prisma: PrismaClient) {
  let config = await prisma.applicationConfig.findUnique({ where: { id: SYSTEM_ID } });
  if (config == null) {
    config = await prisma.applicationConfig.create({ data: { id: SYSTEM_ID } });
  }

  return config;
}

export async function updateAppConfig(data: Partial<ApplicationConfig>, prisma: PrismaClient) {
  await getAppConfig(prisma);
  let config = await prisma.applicationConfig.update({
    data: { ...data, id: SYSTEM_ID },
    where: { id: SYSTEM_ID },
  });
  return config;
}
