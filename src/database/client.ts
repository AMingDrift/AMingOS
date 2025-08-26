import { PrismaClient } from '@prisma/client';

import { truncateExt } from './extensions/truncate';

const prisma = new PrismaClient().$extends(
    truncateExt('sqlite', {
        resetSequence: false,
    }),
);

export { prisma };
