"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BlogController_1 = require("../controllers/BlogController");
const auth_1 = require("../middleware/auth");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", BlogController_1.blogController.getAllBlogs.bind(BlogController_1.blogController));
router.get("/:id", BlogController_1.blogController.getBlogById.bind(BlogController_1.blogController));
router.post("/", auth_1.authenticateToken, auth_1.requireAdmin, BlogController_1.blogController.createBlog.bind(BlogController_1.blogController));
router.put("/:id", auth_1.authenticateToken, auth_1.requireAdmin, BlogController_1.blogController.updateBlog.bind(BlogController_1.blogController));
router.delete("/:id", auth_1.authenticateToken, auth_1.requireAdmin, BlogController_1.blogController.deleteBlog.bind(BlogController_1.blogController));
exports.default = router;
//# sourceMappingURL=blog.js.map