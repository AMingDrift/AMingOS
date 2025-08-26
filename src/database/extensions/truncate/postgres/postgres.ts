import type { PrismaClient } from '@prisma/client';

import type { PostgresConfig } from './types';

import { PostgresForeignKeys, PostgresIdentity } from './types';

export async function truncatePostgresTable(
    client: PrismaClient,
    modelName: string,
    config: PostgresConfig = {},
): Promise<void> {
    const {
        foreignKeys = PostgresForeignKeys.Cascade,
        identity = PostgresIdentity.Restart,
        only = false,
        schema = 'public',
    } = config;

    const sql = [
        `TRUNCATE${only ? ' ONLY' : ''}`,
        `"${schema}"."${modelName}"`,
        `${identity} IDENTITY`,
        `${foreignKeys};`,
    ].join(' ');

    await client.$executeRawUnsafe(sql);
}
