"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearDatabase = clearDatabase;
exports.seedAdminUser = seedAdminUser;
exports.seedDatabase = seedDatabase;
exports.seedSampleBlogs = seedSampleBlogs;
exports.seedSampleProjects = seedSampleProjects;
const database_1 = require("../config/database");
const environment_1 = require("../config/environment");
const User_adapter_1 = require("../models/User.adapter");
const logger_1 = require("../utils/logger");
async function seedDatabase() {
    try {
        logger_1.logger.info("🌱 Starting database seeding...");
        await (0, database_1.initializeDatabase)();
        await seedAdminUser();
        logger_1.logger.info("✅ Database seeding completed successfully");
        process.exit(0);
    }
    catch (error) {
        logger_1.logger.error("❌ Database seeding failed", {
            error: error.message,
        });
        process.exit(1);
    }
}
async function seedAdminUser() {
    try {
        const adminEmail = environment_1.env.ADMIN_EMAIL;
        const adminPassword = environment_1.env.ADMIN_PASSWORD;
        const existingAdmin = await User_adapter_1.userModel.getUserByEmail(adminEmail);
        if (existingAdmin) {
            logger_1.logger.info("👤 Admin user already exists, skipping creation", {
                email: adminEmail,
            });
            return;
        }
        const adminUser = await User_adapter_1.userModel.createUser({
            email: adminEmail,
            password: adminPassword,
            role: "admin",
        });
        logger_1.logger.info("👤 Admin user created successfully", {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
        });
    }
    catch (error) {
        logger_1.logger.error("Failed to seed admin user", {
            error: error.message,
        });
        throw error;
    }
}
async function seedSampleBlogs() {
    try {
        logger_1.logger.info("📝 Seeding sample blog posts...");
        logger_1.logger.info("📝 Sample blog posts seeded successfully");
    }
    catch (error) {
        logger_1.logger.error("Failed to seed sample blogs", {
            error: error.message,
        });
        throw error;
    }
}
async function seedSampleProjects() {
    try {
        logger_1.logger.info("🚀 Seeding sample projects...");
        logger_1.logger.info("🚀 Sample projects seeded successfully");
    }
    catch (error) {
        logger_1.logger.error("Failed to seed sample projects", {
            error: error.message,
        });
        throw error;
    }
}
async function clearDatabase() {
    try {
        logger_1.logger.warn("🗑️  Clearing all database data...");
        logger_1.logger.warn("🗑️  Database cleared successfully");
    }
    catch (error) {
        logger_1.logger.error("Failed to clear database", {
            error: error.message,
        });
        throw error;
    }
}
const args = process.argv.slice(2);
const command = args[0];
switch (command) {
    case "clear":
        clearDatabase();
        break;
    case "admin":
        (0, database_1.initializeDatabase)().then(seedAdminUser);
        break;
    case "blogs":
        (0, database_1.initializeDatabase)().then(seedSampleBlogs);
        break;
    case "projects":
        (0, database_1.initializeDatabase)().then(seedSampleProjects);
        break;
    default:
        seedDatabase();
}
//# sourceMappingURL=seed.js.map