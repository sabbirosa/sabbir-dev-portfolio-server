// Common types and interfaces

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Request types
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: "admin";
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  user: Omit<User, "password">;
}

// Blog types (for future implementation)
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface CreateBlogDto {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> {
  id: string;
}

// Project types (for future implementation)
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  thumbnail?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  content?: string;
  thumbnail?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured?: boolean;
  published?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  id: string;
}

// Error types
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
