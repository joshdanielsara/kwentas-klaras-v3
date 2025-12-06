import type { Prisma } from '@prisma/client';

const slowQueryThreshold = 1000;

export function createQueryLogger(target?: string) {
  return (event: Prisma.QueryEvent) => {
    const duration = event.duration;
    const query = event.query;
    const params = JSON.stringify(event.params);

    if (duration > slowQueryThreshold) {
      console.warn(`[SLOW QUERY] ${target ? `[${target}] ` : ''}${duration}ms`);
      console.warn(`  Query: ${query}`);
      console.warn(
        `  Params: ${params.substring(0, 200)}${params.length > 200 ? '...' : ''}`
      );
    } else if (process.env.NODE_ENV === 'development') {
      console.log(
        `[QUERY] ${target ? `[${target}] ` : ''}${duration}ms - ${query.substring(0, 100)}...`
      );
    }
  };
}

export function getPrismaLogConfig(_target?: string): Prisma.LogDefinition[] {
  const logConfig: Prisma.LogDefinition[] = [
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ];

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.ENABLE_QUERY_LOG === 'true'
  ) {
    logConfig.push({
      level: 'query',
      emit: 'event',
    });
  }

  return logConfig;
}

