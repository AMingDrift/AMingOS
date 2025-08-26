import type { PrismaClient } from '@prisma/client';

import { Prisma } from '@prisma/client';

import type { ConnectorType, RootConfig } from './types';

import { PrismaExtensionsTruncateUnknownConnectorError } from './errors';
import { getConnectorExtension, supportedConnector } from './utils';

export function truncateExt<T extends ConnectorType>(connector: T, config?: RootConfig<T>) {
    const { ...rootConfig } = config || {};

    if (!supportedConnector(connector))
        throw new PrismaExtensionsTruncateUnknownConnectorError(connector);

    const extension = getConnectorExtension(connector);

    return Prisma.defineExtension((client) => {
        return client.$extends({
            name: `truncate/${connector}`,
            model: {
                $allModels: {
                    async $truncate<Model>(this: Model, localConfig?: RootConfig<T>) {
                        const ctx = Prisma.getExtensionContext(this);
                        const execConfig = { ...rootConfig, ...localConfig };
                        const tableName = (client as any)._runtimeDataModel.models[ctx.$name!]
                            .dbName;
                        await extension(client as PrismaClient, tableName, execConfig);
                    },
                },
            },
        });
    });
}
