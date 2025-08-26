export interface MySQLConfig {
    /**
     * false: Temporarily disables referential constraints (set FOREIGN_KEY_CHECKS to 0) before truncating the tables.
     *
     * @defaultValue false
     */
    foreignKeyChecks?: boolean;

    // TODO: Add support
    // schema?: string
}

export interface MySQLExtensionConfig extends MySQLConfig {
    connector: 'mysql';
}
