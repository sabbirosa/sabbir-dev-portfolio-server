"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = exports.UserModelAdapter = void 0;
const User_mongoose_1 = require("./User.mongoose");
class UserModelAdapter {
    toUser(doc) {
        return {
            id: doc._id.toString(),
            email: doc.email,
            password: doc.password,
            role: doc.role,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
    async getUserById(id) {
        try {
            const user = await User_mongoose_1.UserModel.findById(id).select("+password");
            return user ? this.toUser(user) : null;
        }
        catch (error) {
            console.error("Error getting user by ID:", error);
            return null;
        }
    }
    async getUserByEmail(email) {
        try {
            const user = await User_mongoose_1.UserModel.findOne({ email }).select("+password");
            return user ? this.toUser(user) : null;
        }
        catch (error) {
            console.error("Error getting user by email:", error);
            return null;
        }
    }
    async createUser(userData) {
        const existingUser = await this.getUserByEmail(userData.email);
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
        const newUser = await User_mongoose_1.UserModel.create({
            email: userData.email,
            password: userData.password,
            role: userData.role || "admin",
        });
        const createdUser = await User_mongoose_1.UserModel.findById(newUser._id).select("+password");
        if (!createdUser) {
            throw new Error("Failed to create user");
        }
        return this.toUser(createdUser);
    }
    async authenticateUser(email, password) {
        try {
            const user = await User_mongoose_1.UserModel.findOne({ email }).select("+password");
            if (!user)
                return null;
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid)
                return null;
            return this.toUser(user);
        }
        catch (error) {
            console.error("Error authenticating user:", error);
            return null;
        }
    }
    async updateUser(id, updates) {
        try {
            if (updates.password) {
                delete updates.password;
            }
            const updatedUser = await User_mongoose_1.UserModel.findByIdAndUpdate(id, updates, { new: true }).select("+password");
            return updatedUser ? this.toUser(updatedUser) : null;
        }
        catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    }
    async changePassword(id, newPassword) {
        try {
            if (newPassword.length < 6) {
                throw new Error("Password must be at least 6 characters long");
            }
            const user = await User_mongoose_1.UserModel.findById(id);
            if (!user)
                return null;
            user.password = newPassword;
            await user.save();
            const updatedUser = await User_mongoose_1.UserModel.findById(id).select("+password");
            return updatedUser ? this.toUser(updatedUser) : null;
        }
        catch (error) {
            console.error("Error changing password:", error);
            return null;
        }
    }
    async deleteUser(id) {
        try {
            const result = await User_mongoose_1.UserModel.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    }
    async getAllUsers() {
        try {
            const users = await User_mongoose_1.UserModel.find().select("+password");
            return users.map((user) => this.toUser(user));
        }
        catch (error) {
            console.error("Error getting all users:", error);
            return [];
        }
    }
    async getUserCount() {
        try {
            return await User_mongoose_1.UserModel.countDocuments();
        }
        catch (error) {
            console.error("Error getting user count:", error);
            return 0;
        }
    }
    sanitizeUser(user) {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
    }
}
exports.UserModelAdapter = UserModelAdapter;
exports.userModel = new UserModelAdapter();
//# sourceMappingURL=User.adapter.js.map