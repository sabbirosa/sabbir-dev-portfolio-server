export interface EnvironmentConfig {
    NODE_ENV: string;
    PORT: number;
    HOST: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    FRONTEND_URL: string;
    MONGODB_URI: string;
    RATE_LIMIT_MAX: number;
    RATE_LIMIT_WINDOW_MS: number;
    LOG_LEVEL: string;
}
export declare const env: EnvironmentConfig;
export declare const isDevelopment: boolean;
export declare const isProduction: boolean;
export declare const isTest: boolean;
//# sourceMappingURL=environment.d.ts.map