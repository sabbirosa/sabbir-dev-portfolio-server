import { User } from "../types";
export interface JWTPayload {
    id: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}
export declare class JWTService {
    private static readonly secret;
    private static readonly expiresIn;
    static generateToken(user: User): string;
    static verifyToken(token: string): JWTPayload;
    static extractTokenFromHeader(authorizationHeader?: string | undefined): string | null;
    static isTokenExpired(token: string): boolean;
    static getTokenExpiration(token: string): Date | null;
}
//# sourceMappingURL=jwt.d.ts.map