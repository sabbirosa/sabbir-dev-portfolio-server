export interface DatabaseConfig {
    type: "memory" | "prisma" | "mongodb";
    connectionString?: string;
    options?: Record<string, any>;
}
export declare const databaseConfig: DatabaseConfig;
export declare const initializeDatabase: () => Promise<void>;
export declare const closeDatabase: () => Promise<void>;
//# sourceMappingURL=database.d.ts.map