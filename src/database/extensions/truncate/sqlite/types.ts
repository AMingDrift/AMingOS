export interface SQLiteConfig {
    /**
     * true: All sequences on the truncated tables will be reset
     * false: All sequences on the truncated tables will not be reset and continue from their last value
     *
     * @defaultValue true
     */
    resetSequence?: boolean;
}

export interface SQLiteExtensionConfig extends SQLiteConfig {
    connector: 'sqlite';
}
