import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import {
  createQueryLogger,
  getPrismaLogConfig,
} from '../utils/queryProfiler.js';

declare global {
  var __prisma: PrismaClient | undefined;
}

const logConfig = getPrismaLogConfig('main');
const prismaClient = new PrismaClient({
  log: logConfig,
});

if (logConfig.some((log) => log.level === 'query' && log.emit === 'event')) {
  prismaClient.$on('query', createQueryLogger('main') as (event: Prisma.QueryEvent) => void);
}

export const prisma =
  global.__prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

