import { Request, Response } from "express";
import { ExperienceModel } from "../models/Experience";
import { logger } from "../utils/logger";

export class ExperienceController {
  // Get all experience entries (public)
  async getAllExperience(req: Request, res: Response): Promise<void> {
    try {
      const experience = await ExperienceModel.find()
        .sort({ order: 1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        count: experience.length,
        data: experience,
      });
    } catch (error: any) {
      logger.error("Error fetching experience", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch experience",
        error: error.message,
      });
    }
  }

  // Get single experience entry (public)
  async getExperienceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const experience = await ExperienceModel.findById(id).select("-__v");

      if (!experience) {
        res.status(404).json({
          success: false,
          message: "Experience entry not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: experience,
      });
    } catch (error: any) {
      logger.error("Error fetching experience", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch experience",
        error: error.message,
      });
    }
  }

  // Create experience entry (protected - admin only)
  async createExperience(req: Request, res: Response): Promise<void> {
    try {
      const experienceData = req.body;

      if (
        !experienceData.position ||
        !experienceData.company ||
        !experienceData.year
      ) {
        res.status(400).json({
          success: false,
          message: "Position, company, and year are required",
        });
        return;
      }

      const experience = await ExperienceModel.create(experienceData);
      logger.info("Experience created", { experienceId: experience._id });

      res.status(201).json({
        success: true,
        message: "Experience created successfully",
        data: experience,
      });
    } catch (error: any) {
      logger.error("Error creating experience", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to create experience",
        error: error.message,
      });
    }
  }

  // Update experience entry (protected - admin only)
  async updateExperience(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const experience = await ExperienceModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!experience) {
        res.status(404).json({
          success: false,
          message: "Experience entry not found",
        });
        return;
      }

      logger.info("Experience updated", { experienceId: experience._id });

      res.status(200).json({
        success: true,
        message: "Experience updated successfully",
        data: experience,
      });
    } catch (error: any) {
      logger.error("Error updating experience", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to update experience",
        error: error.message,
      });
    }
  }

  // Delete experience entry (protected - admin only)
  async deleteExperience(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const experience = await ExperienceModel.findByIdAndDelete(id);

      if (!experience) {
        res.status(404).json({
          success: false,
          message: "Experience entry not found",
        });
        return;
      }

      logger.info("Experience deleted", { experienceId: id });

      res.status(200).json({
        success: true,
        message: "Experience deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting experience", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete experience",
        error: error.message,
      });
    }
  }
}

export const experienceController = new ExperienceController();
