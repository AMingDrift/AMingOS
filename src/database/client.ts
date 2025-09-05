import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { withBark } from 'prisma-extension-bark';

import { truncateExt } from './extensions/truncate';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter })
    .$extends(
        truncateExt('postgres', {
            // resetSequence: false,
        }),
    )
    .$extends(withBark({ modelNames: ['category'] }));

export { prisma };
