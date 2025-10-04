import { CreateUserDto, User } from "../types";
import bcrypt from "bcryptjs";

// In-memory storage for demo purposes
// In production, this would be replaced with database operations
class UserRepository {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async create(userData: CreateUserDto): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const user: User = {
      id,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.set(id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async count(): Promise<number> {
    return this.users.size;
  }

  // Utility method for password verification
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Method to clear all users (useful for testing)
  async clear(): Promise<void> {
    this.users.clear();
  }
}

// Export singleton instance
export const userRepository = new UserRepository();

// User model class with business logic
export class UserModel {
  constructor(private repository: UserRepository) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.repository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    // Validate password strength
    if (userData.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    return this.repository.create(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.repository.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await this.repository.verifyPassword(
      password,
      user.password
    );
    if (!isPasswordValid) return null;

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    // Don't allow direct password updates through this method
    if (updates.password) {
      delete updates.password;
    }

    return this.repository.update(id, updates);
  }

  async changePassword(id: string, newPassword: string): Promise<User | null> {
    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return this.repository.update(id, { password: hashedPassword });
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
  }

  async getUserCount(): Promise<number> {
    return this.repository.count();
  }

  // Helper method to get user without password
  public sanitizeUser(user: User): Omit<User, "password"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// Export singleton instance
export const userModel = new UserModel(userRepository);
