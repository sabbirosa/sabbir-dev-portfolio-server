export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
declare class Logger {
    private logLevel;
    constructor();
    private getLogLevelFromEnv;
    private shouldLog;
    private formatMessage;
    error(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
    debug(message: string, meta?: any): void;
    logRequest(method: string, url: string, statusCode: number, responseTime: number): void;
    logDatabase(operation: string, table: string, duration?: number): void;
    logAuth(event: string, userId?: string, email?: string): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map