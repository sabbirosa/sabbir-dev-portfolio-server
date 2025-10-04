"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
const environment_1 = require("../config/environment");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    constructor() {
        this.logLevel = this.getLogLevelFromEnv(environment_1.env.LOG_LEVEL);
    }
    getLogLevelFromEnv(level) {
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
    shouldLog(level) {
        return level <= this.logLevel;
    }
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
        return `[${timestamp}] ${level}: ${message}${metaStr}`;
    }
    error(message, meta) {
        if (this.shouldLog(LogLevel.ERROR)) {
            console.error(this.formatMessage("ERROR", message, meta));
        }
    }
    warn(message, meta) {
        if (this.shouldLog(LogLevel.WARN)) {
            console.warn(this.formatMessage("WARN", message, meta));
        }
    }
    info(message, meta) {
        if (this.shouldLog(LogLevel.INFO)) {
            console.info(this.formatMessage("INFO", message, meta));
        }
    }
    debug(message, meta) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.debug(this.formatMessage("DEBUG", message, meta));
        }
    }
    logRequest(method, url, statusCode, responseTime) {
        const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;
        if (statusCode >= 500) {
            this.error(message);
        }
        else if (statusCode >= 400) {
            this.warn(message);
        }
        else {
            this.info(message);
        }
    }
    logDatabase(operation, table, duration) {
        const message = `DB ${operation} on ${table}${duration ? ` - ${duration}ms` : ""}`;
        this.debug(message);
    }
    logAuth(event, userId, email) {
        const message = `Auth ${event}${userId ? ` - User: ${userId}` : ""}${email ? ` - Email: ${email}` : ""}`;
        this.info(message);
    }
}
exports.logger = new Logger();
//# sourceMappingURL=logger.js.map