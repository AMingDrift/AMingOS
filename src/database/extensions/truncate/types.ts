import type { MySQLExtensionConfig } from './mysql';
import type { PostgresExtensionConfig } from './postgres';
import type { SQLiteExtensionConfig } from './sqlite';

export const ConnectorTypes = ['mysql', 'postgres', 'sqlite'] as const;
export type ConnectorType = (typeof ConnectorTypes)[number];

export interface ExtensionConfigMap {
    mysql: MySQLExtensionConfig;
    postgres: PostgresExtensionConfig;
    sqlite: SQLiteExtensionConfig;
}

export type RootConfig<T extends ConnectorType> = Omit<ExtensionConfigMap[T], 'connector'>;
