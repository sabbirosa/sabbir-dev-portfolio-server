import { CreateUserDto, User } from "../types";
import { IUser, UserModel as MongooseUserModel } from "./User.mongoose";

/**
 * Adapter class to bridge Mongoose User Model with the application's User interface
 * This ensures the auth system works with persistent MongoDB storage
 */
export class UserModelAdapter {
  /**
   * Convert Mongoose IUser document to application User type
   */
  private toUser(doc: IUser): User {
    return {
      id: (doc._id as any).toString(),
      email: doc.email,
      password: doc.password,
      role: doc.role as "admin",
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await MongooseUserModel.findById(id).select("+password");
      return user ? this.toUser(user) : null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await MongooseUserModel.findOne({ email }).select(
        "+password"
      );
      return user ? this.toUser(user) : null;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(userData.email);
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

    // Create user in MongoDB
    const newUser = await MongooseUserModel.create({
      email: userData.email,
      password: userData.password,
      role: userData.role || "admin",
    });

    // Fetch the created user with password to match the interface
    const createdUser = await MongooseUserModel.findById(newUser._id).select(
      "+password"
    );

    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return this.toUser(createdUser);
  }

  /**
   * Authenticate user with email and password
   */
  async authenticateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    try {
      const user = await MongooseUserModel.findOne({ email }).select(
        "+password"
      );
      if (!user) return null;

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) return null;

      return this.toUser(user);
    } catch (error) {
      console.error("Error authenticating user:", error);
      return null;
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      // Don't allow direct password updates through this method
      if (updates.password) {
        delete updates.password;
      }

      const updatedUser = await MongooseUserModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).select("+password");

      return updatedUser ? this.toUser(updatedUser) : null;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  /**
   * Change user password
   */
  async changePassword(id: string, newPassword: string): Promise<User | null> {
    try {
      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const user = await MongooseUserModel.findById(id);
      if (!user) return null;

      user.password = newPassword;
      await user.save(); // This will trigger the pre-save hook to hash the password

      const updatedUser = await MongooseUserModel.findById(id).select(
        "+password"
      );
      return updatedUser ? this.toUser(updatedUser) : null;
    } catch (error) {
      console.error("Error changing password:", error);
      return null;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await MongooseUserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await MongooseUserModel.find().select("+password");
      return users.map((user) => this.toUser(user));
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  /**
   * Get user count
   */
  async getUserCount(): Promise<number> {
    try {
      return await MongooseUserModel.countDocuments();
    } catch (error) {
      console.error("Error getting user count:", error);
      return 0;
    }
  }

  /**
   * Remove password from user object
   */
  sanitizeUser(user: User): Omit<User, "password"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

// Export singleton instance
export const userModel = new UserModelAdapter();
