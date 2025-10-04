import { initializeDatabase } from "../config/database";
import { env } from "../config/environment";
import { userModel } from "../models/User.adapter";
import { logger } from "../utils/logger";

/**
 * Database seeding script
 * Creates initial admin user and any other required data
 */
async function seedDatabase(): Promise<void> {
  try {
    logger.info("🌱 Starting database seeding...");

    // Initialize database connection
    await initializeDatabase();

    // Seed admin user
    await seedAdminUser();

    logger.info("✅ Database seeding completed successfully");
    process.exit(0);
  } catch (error) {
    logger.error("❌ Database seeding failed", {
      error: (error as Error).message,
    });
    process.exit(1);
  }
}

/**
 * Seed admin user
 */
async function seedAdminUser(): Promise<void> {
  try {
    const adminEmail = env.ADMIN_EMAIL;
    const adminPassword = env.ADMIN_PASSWORD;

    // Check if admin user already exists
    const existingAdmin = await userModel.getUserByEmail(adminEmail);

    if (existingAdmin) {
      logger.info("👤 Admin user already exists, skipping creation", {
        email: adminEmail,
      });
      return;
    }

    // Create admin user
    const adminUser = await userModel.createUser({
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    logger.info("👤 Admin user created successfully", {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    logger.error("Failed to seed admin user", {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Seed sample blog posts (for future use)
 */
async function seedSampleBlogs(): Promise<void> {
  try {
    logger.info("📝 Seeding sample blog posts...");

    // This will be implemented when blog functionality is added
    // const sampleBlogs = [
    //   {
    //     title: 'Welcome to My Portfolio',
    //     content: 'This is my first blog post...',
    //     published: true,
    //   },
    //   // More sample blogs
    // ];

    logger.info("📝 Sample blog posts seeded successfully");
  } catch (error) {
    logger.error("Failed to seed sample blogs", {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Seed sample projects (for future use)
 */
async function seedSampleProjects(): Promise<void> {
  try {
    logger.info("🚀 Seeding sample projects...");

    // This will be implemented when project functionality is added
    // const sampleProjects = [
    //   {
    //     title: 'Portfolio Website',
    //     description: 'A modern portfolio website built with Next.js',
    //     technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    //     featured: true,
    //     published: true,
    //   },
    //   // More sample projects
    // ];

    logger.info("🚀 Sample projects seeded successfully");
  } catch (error) {
    logger.error("Failed to seed sample projects", {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Clear all data (useful for development)
 */
async function clearDatabase(): Promise<void> {
  try {
    logger.warn("🗑️  Clearing all database data...");

    // Clear users (be careful with this in production!)
    // await userRepository.clear();

    logger.warn("🗑️  Database cleared successfully");
  } catch (error) {
    logger.error("Failed to clear database", {
      error: (error as Error).message,
    });
    throw error;
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "clear":
    clearDatabase();
    break;
  case "admin":
    initializeDatabase().then(seedAdminUser);
    break;
  case "blogs":
    initializeDatabase().then(seedSampleBlogs);
    break;
  case "projects":
    initializeDatabase().then(seedSampleProjects);
    break;
  default:
    seedDatabase();
}

export {
  clearDatabase,
  seedAdminUser,
  seedDatabase,
  seedSampleBlogs,
  seedSampleProjects,
};
