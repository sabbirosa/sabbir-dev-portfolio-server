import { env } from "../config/environment";

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

class Logger {
  private logLevel: LogLevel;

  constructor() {
    this.logLevel = this.getLogLevelFromEnv(env.LOG_LEVEL);
  }

  private getLogLevelFromEnv(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case "error":
        return LogLevel.ERROR;
      case "warn":
        return LogLevel.WARN;
      case "info":
        return LogLevel.INFO;
      case "debug":
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("ERROR", message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("WARN", message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage("INFO", message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage("DEBUG", message, meta));
    }
  }

  // HTTP request logging
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number
  ): void {
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;

    if (statusCode >= 500) {
      this.error(message);
    } else if (statusCode >= 400) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }

  // Database operation logging
  logDatabase(operation: string, table: string, duration?: number): void {
    const message = `DB ${operation} on ${table}${
      duration ? ` - ${duration}ms` : ""
    }`;
    this.debug(message);
  }

  // Authentication logging
  logAuth(event: string, userId?: string, email?: string): void {
    const message = `Auth ${event}${userId ? ` - User: ${userId}` : ""}${
      email ? ` - Email: ${email}` : ""
    }`;
    this.info(message);
  }
}

// Export singleton instance
export const logger = new Logger();
