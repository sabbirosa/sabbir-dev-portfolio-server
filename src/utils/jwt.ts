import { env } from "@/config/environment";
import { User } from "@/types";
import jwt from "jsonwebtoken";

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export class JWTService {
  private static readonly secret = env.JWT_SECRET;
  private static readonly expiresIn = env.JWT_EXPIRES_IN;

  /**
   * Generate JWT token for user
   */
  static generateToken(user: User): string {
    const payload: Omit<JWTPayload, "iat" | "exp"> = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token has expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(
    authorizationHeader?: string | undefined
  ): string | null {
    if (!authorizationHeader) return null;

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1] || null;
  }

  /**
   * Check if token is expired without throwing error
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiration date
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded || !decoded.exp) return null;

      return new Date(decoded.exp * 1000);
    } catch {
      return null;
    }
  }
}
