"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = exports.ProjectController = void 0;
const Project_1 = require("../models/Project");
const logger_1 = require("../utils/logger");
class ProjectController {
    async getAllProjects(req, res) {
        try {
            const { featured } = req.query;
            const filter = {};
            if (featured !== undefined) {
                filter.featured = featured === "true";
            }
            const projects = await Project_1.ProjectModel.find(filter)
                .sort({ order: 1, year: -1 })
                .select("-__v");
            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching projects", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch projects",
                error: error.message,
            });
        }
    }
    async getProjectById(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.ProjectModel.findById(id).select("-__v");
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: project,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching project", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch project",
                error: error.message,
            });
        }
    }
    async createProject(req, res) {
        try {
            const projectData = req.body;
            if (!projectData.title ||
                !projectData.description ||
                !projectData.image ||
                !projectData.liveLink ||
                !projectData.year ||
                !projectData.techStack) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, image, live link, year, and tech stack are required",
                });
                return;
            }
            const project = await Project_1.ProjectModel.create(projectData);
            logger_1.logger.info("Project created", { projectId: project._id });
            res.status(201).json({
                success: true,
                message: "Project created successfully",
                data: project,
            });
        }
        catch (error) {
            logger_1.logger.error("Error creating project", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to create project",
                error: error.message,
            });
        }
    }
    async updateProject(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const project = await Project_1.ProjectModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-__v");
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
                return;
            }
            logger_1.logger.info("Project updated", { projectId: project._id });
            res.status(200).json({
                success: true,
                message: "Project updated successfully",
                data: project,
            });
        }
        catch (error) {
            logger_1.logger.error("Error updating project", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to update project",
                error: error.message,
            });
        }
    }
    async deleteProject(req, res) {
        try {
            const { id } = req.params;
            const project = await Project_1.ProjectModel.findByIdAndDelete(id);
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
                return;
            }
            logger_1.logger.info("Project deleted", { projectId: id });
            res.status(200).json({
                success: true,
                message: "Project deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting project", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to delete project",
                error: error.message,
            });
        }
    }
}
exports.ProjectController = ProjectController;
exports.projectController = new ProjectController();
//# sourceMappingURL=ProjectController.js.map