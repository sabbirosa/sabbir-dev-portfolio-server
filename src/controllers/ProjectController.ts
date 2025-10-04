import { ProjectModel } from "../models/Project";
import { logger } from "../utils/logger";
import { Request, Response } from "express";

/**
 * Project Controller
 * Handles all project-related operations
 */
export class ProjectController {
  /**
   * Get all projects (public)
   * @route GET /api/projects
   */
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const { featured } = req.query;

      // Filter by featured status if specified
      const filter: any = {};
      if (featured !== undefined) {
        filter.featured = featured === "true";
      }

      const projects = await ProjectModel.find(filter)
        .sort({ order: 1, year: -1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    } catch (error: any) {
      logger.error("Error fetching projects", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch projects",
        error: error.message,
      });
    }
  }

  /**
   * Get a single project by ID (public)
   * @route GET /api/projects/:id
   */
  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const project = await ProjectModel.findById(id).select("-__v");

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
    } catch (error: any) {
      logger.error("Error fetching project", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch project",
        error: error.message,
      });
    }
  }

  /**
   * Create a new project (protected - admin only)
   * @route POST /api/projects
   */
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const projectData = req.body;

      // Validate required fields
      if (
        !projectData.title ||
        !projectData.description ||
        !projectData.image ||
        !projectData.liveLink ||
        !projectData.year ||
        !projectData.techStack
      ) {
        res.status(400).json({
          success: false,
          message:
            "Title, description, image, live link, year, and tech stack are required",
        });
        return;
      }

      const project = await ProjectModel.create(projectData);

      logger.info("Project created", { projectId: project._id });

      res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
      });
    } catch (error: any) {
      logger.error("Error creating project", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to create project",
        error: error.message,
      });
    }
  }

  /**
   * Update a project (protected - admin only)
   * @route PUT /api/projects/:id
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const project = await ProjectModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      logger.info("Project updated", { projectId: project._id });

      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error: any) {
      logger.error("Error updating project", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to update project",
        error: error.message,
      });
    }
  }

  /**
   * Delete a project (protected - admin only)
   * @route DELETE /api/projects/:id
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const project = await ProjectModel.findByIdAndDelete(id);

      if (!project) {
        res.status(404).json({
          success: false,
          message: "Project not found",
        });
        return;
      }

      logger.info("Project deleted", { projectId: id });

      res.status(200).json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting project", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete project",
        error: error.message,
      });
    }
  }
}

export const projectController = new ProjectController();
