import type { PrismaClient } from '@prisma/client';

import type { MySQLConfig } from './types';

export async function truncateMySQLTable(
    client: PrismaClient,
    modelName: string,
    config: MySQLConfig = {},
): Promise<void> {
    const { foreignKeyChecks = false } = config;

    const sql = `TRUNCATE TABLE ${modelName};`;

    if (foreignKeyChecks) {
        await client.$executeRawUnsafe(sql);
        return;
    }

    await client.$transaction([
        client.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=0;`),
        client.$executeRawUnsafe(sql),
        client.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS=1;`),
    ]);
}
