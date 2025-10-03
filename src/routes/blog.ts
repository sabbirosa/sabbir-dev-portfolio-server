import { blogController } from "@/controllers/BlogController";
import { authenticateToken, requireAdmin } from "@/middleware/auth";
import { Router } from "express";

const router = Router();

// Public routes
router.get("/", blogController.getAllBlogs.bind(blogController));
router.get("/:id", blogController.getBlogById.bind(blogController));

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  blogController.createBlog.bind(blogController)
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  blogController.updateBlog.bind(blogController)
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  blogController.deleteBlog.bind(blogController)
);

export default router;
