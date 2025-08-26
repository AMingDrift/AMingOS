import type { ConnectorType } from './types';

export class PrismaExtensionsTruncateError extends Error {
    constructor(message: string) {
        super(`truncate: ${message}`);
        this.name = 'PrismaExtensionsError';
    }
}

export class PrismaExtensionsTruncateUnknownConnectorError extends PrismaExtensionsTruncateError {
    constructor(connector: ConnectorType) {
        super(`Unknown connector. You provided: \`${connector}\``);
        this.name = 'PrismaExtensionsTruncateUnknownConnectorError';
    }
}
