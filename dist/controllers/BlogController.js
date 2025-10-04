"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogController = exports.BlogController = void 0;
const Blog_1 = require("../models/Blog");
const logger_1 = require("../utils/logger");
class BlogController {
    async getAllBlogs(req, res) {
        try {
            const { published } = req.query;
            const filter = {};
            if (published !== undefined) {
                filter.published = published === "true";
            }
            const blogs = await Blog_1.BlogModel.find(filter)
                .sort({ date: -1 })
                .select("-__v");
            res.status(200).json({
                success: true,
                count: blogs.length,
                data: blogs,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching blogs", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch blogs",
                error: error.message,
            });
        }
    }
    async getBlogById(req, res) {
        try {
            const { id } = req.params;
            const blog = await Blog_1.BlogModel.findById(id).select("-__v");
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
        }
        catch (error) {
            logger_1.logger.error("Error fetching blog", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch blog",
                error: error.message,
            });
        }
    }
    async createBlog(req, res) {
        try {
            const blogData = req.body;
            if (!blogData.title || !blogData.description || !blogData.content) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and content are required",
                });
                return;
            }
            const blog = await Blog_1.BlogModel.create(blogData);
            logger_1.logger.info("Blog created", { blogId: blog._id });
            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: blog,
            });
        }
        catch (error) {
            logger_1.logger.error("Error creating blog", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to create blog",
                error: error.message,
            });
        }
    }
    async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const blog = await Blog_1.BlogModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-__v");
            if (!blog) {
                res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
                return;
            }
            logger_1.logger.info("Blog updated", { blogId: blog._id });
            res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                data: blog,
            });
        }
        catch (error) {
            logger_1.logger.error("Error updating blog", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to update blog",
                error: error.message,
            });
        }
    }
    async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            const blog = await Blog_1.BlogModel.findByIdAndDelete(id);
            if (!blog) {
                res.status(404).json({
                    success: false,
                    message: "Blog not found",
                });
                return;
            }
            logger_1.logger.info("Blog deleted", { blogId: id });
            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting blog", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to delete blog",
                error: error.message,
            });
        }
    }
}
exports.BlogController = BlogController;
exports.blogController = new BlogController();
//# sourceMappingURL=BlogController.js.map