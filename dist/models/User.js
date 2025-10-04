"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserModel = exports.userRepository = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRepository {
    constructor() {
        this.users = new Map();
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async findByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }
    async create(userData) {
        const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 12);
        const user = {
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
    async update(id, updates) {
        const user = this.users.get(id);
        if (!user)
            return null;
        const updatedUser = {
            ...user,
            ...updates,
            updatedAt: new Date(),
        };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    async delete(id) {
        return this.users.delete(id);
    }
    async findAll() {
        return Array.from(this.users.values());
    }
    async count() {
        return this.users.size;
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    async clear() {
        this.users.clear();
    }
}
exports.userRepository = new UserRepository();
class UserModel {
    constructor(repository) {
        this.repository = repository;
    }
    async createUser(userData) {
        const existingUser = await this.repository.findByEmail(userData.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error("Invalid email format");
        }
        if (userData.password.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
        return this.repository.create(userData);
    }
    async getUserById(id) {
        return this.repository.findById(id);
    }
    async getUserByEmail(email) {
        return this.repository.findByEmail(email);
    }
    async authenticateUser(email, password) {
        const user = await this.repository.findByEmail(email);
        if (!user)
            return null;
        const isPasswordValid = await this.repository.verifyPassword(password, user.password);
        if (!isPasswordValid)
            return null;
        return user;
    }
    async updateUser(id, updates) {
        if (updates.password) {
            delete updates.password;
        }
        return this.repository.update(id, updates);
    }
    async changePassword(id, newPassword) {
        if (newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        return this.repository.update(id, { password: hashedPassword });
    }
    async deleteUser(id) {
        return this.repository.delete(id);
    }
    async getAllUsers() {
        return this.repository.findAll();
    }
    async getUserCount() {
        return this.repository.count();
    }
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
exports.UserModel = UserModel;
exports.userModel = new UserModel(exports.userRepository);
//# sourceMappingURL=User.js.map