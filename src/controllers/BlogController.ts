import { BlogModel } from "@/models/Blog";
import { logger } from "@/utils/logger";
import { Request, Response } from "express";

/**
 * Blog Controller
 * Handles all blog-related operations
 */
export class BlogController {
  /**
   * Get all blogs (public)
   * @route GET /api/blogs
   */
  async getAllBlogs(req: Request, res: Response): Promise<void> {
    try {
      const { published } = req.query;

      // Filter by published status if specified
      const filter: any = {};
      if (published !== undefined) {
        filter.published = published === "true";
      }

      const blogs = await BlogModel.find(filter)
        .sort({ date: -1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        count: blogs.length,
        data: blogs,
      });
    } catch (error: any) {
      logger.error("Error fetching blogs", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch blogs",
        error: error.message,
      });
    }
  }

  /**
   * Get a single blog by ID (public)
   * @route GET /api/blogs/:id
   */
  async getBlogById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const blog = await BlogModel.findById(id).select("-__v");

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      logger.error("Error fetching blog", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch blog",
        error: error.message,
      });
    }
  }

  /**
   * Create a new blog (protected - admin only)
   * @route POST /api/blogs
   */
  async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const blogData = req.body;

      // Validate required fields
      if (!blogData.title || !blogData.description || !blogData.content) {
        res.status(400).json({
          success: false,
          message: "Title, description, and content are required",
        });
        return;
      }

      const blog = await BlogModel.create(blogData);

      logger.info("Blog created", { blogId: blog._id });

      res.status(201).json({
        success: true,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (error: any) {
      logger.error("Error creating blog", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to create blog",
        error: error.message,
      });
    }
  }

  /**
   * Update a blog (protected - admin only)
   * @route PUT /api/blogs/:id
   */
  async updateBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const blog = await BlogModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
        return;
      }

      logger.info("Blog updated", { blogId: blog._id });

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error: any) {
      logger.error("Error updating blog", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to update blog",
        error: error.message,
      });
    }
  }

  /**
   * Delete a blog (protected - admin only)
   * @route DELETE /api/blogs/:id
   */
  async deleteBlog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const blog = await BlogModel.findByIdAndDelete(id);

      if (!blog) {
        res.status(404).json({
          success: false,
          message: "Blog not found",
        });
        return;
      }

      logger.info("Blog deleted", { blogId: id });

      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting blog", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete blog",
        error: error.message,
      });
    }
  }
}

export const blogController = new BlogController();
