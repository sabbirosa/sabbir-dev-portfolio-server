import { NextFunction, Request, Response } from "express";
export declare const createRateLimiter: (windowMs?: number, max?: number) => import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const apiRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const securityHeaders: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const requestSizeLimiter: (req: Request, res: Response, next: NextFunction) => void;
export declare const createIPWhitelist: (allowedIPs: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requestTimeout: (timeoutMs?: number) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map