export interface PostgresConfig {
    /**
     * Cascade: All tables that have a foreign key reference to [TABLE NAME] will be truncated as well.
     * Restrict: All tables that have a foreign key reference to [TABLE NAME] will not be truncated unless they were listed in the TRUNCATE TABLE statement
     *
     * @defaultValue TruncatePostgresForeignKeys.Cascade
     */
    foreignKeys?: PostgresForeignKeysType;

    /**
     * Continue: All sequences on the truncated tables will not be reset and continue from their last value
     * Restart: All sequences on the truncated tables will be reset
     *
     * @defaultValue TruncatePostgresIdentity.Restart
     */
    identity?: PostgresIdentityType;

    /**
     * true: Only the specified table is truncated. If the table has any descendant tables, they are not truncated.
     * false: The specified table and all its descendant tables (if any) are truncated.
     *
     * @defaultValue true
     */
    only?: boolean;

    /**
     * true: Only the specified table is truncated. If the table has any descendant tables, they are not truncated.
     * false: The specified table and all its descendant tables (if any) are truncated.
     *
     * @defaultValue true
     */
    schema?: string;
}

export interface PostgresExtensionConfig extends PostgresConfig {
    connector: 'postgres';
}

export const PostgresIdentity = {
    Restart: 'RESTART',
    Continue: 'CONTINUE',
} as const;

export const PostgresForeignKeys = {
    Cascade: 'CASCADE',
    Restrict: 'RESTRICT',
} as const;

export type PostgresIdentityType = (typeof PostgresIdentity)[keyof typeof PostgresIdentity];
export type PostgresForeignKeysType =
    (typeof PostgresForeignKeys)[keyof typeof PostgresForeignKeys];
