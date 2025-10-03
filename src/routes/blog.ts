import { Router } from "express";
import { blogController } from "@/controllers/BlogController";
import { authenticate } from "@/middleware/auth";

const router = Router();

// Public routes
router.get("/", blogController.getAllBlogs.bind(blogController));
router.get("/:id", blogController.getBlogById.bind(blogController));

// Protected routes (admin only)
router.post("/", authenticate, blogController.createBlog.bind(blogController));
router.put("/:id", authenticate, blogController.updateBlog.bind(blogController));
router.delete("/:id", authenticate, blogController.deleteBlog.bind(blogController));

export default router;

