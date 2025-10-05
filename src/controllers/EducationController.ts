import { Request, Response } from "express";
import { EducationModel } from "../models/Education";
import { logger } from "../utils/logger";

export class EducationController {
  // Get all education entries (public)
  async getAllEducation(req: Request, res: Response): Promise<void> {
    try {
      const education = await EducationModel.find()
        .sort({ order: 1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        count: education.length,
        data: education,
      });
    } catch (error: any) {
      logger.error("Error fetching education", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch education",
        error: error.message,
      });
    }
  }

  // Get single education entry (public)
  async getEducationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const education = await EducationModel.findById(id).select("-__v");

      if (!education) {
        res.status(404).json({
          success: false,
          message: "Education entry not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: education,
      });
    } catch (error: any) {
      logger.error("Error fetching education", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch education",
        error: error.message,
      });
    }
  }

  // Create education entry (protected - admin only)
  async createEducation(req: Request, res: Response): Promise<void> {
    try {
      const educationData = req.body;

      if (
        !educationData.degree ||
        !educationData.institution ||
        !educationData.year
      ) {
        res.status(400).json({
          success: false,
          message: "Degree, institution, and year are required",
        });
        return;
      }

      const education = await EducationModel.create(educationData);
      logger.info("Education created", { educationId: education._id });

      res.status(201).json({
        success: true,
        message: "Education created successfully",
        data: education,
      });
    } catch (error: any) {
      logger.error("Error creating education", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to create education",
        error: error.message,
      });
    }
  }

  // Update education entry (protected - admin only)
  async updateEducation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const education = await EducationModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!education) {
        res.status(404).json({
          success: false,
          message: "Education entry not found",
        });
        return;
      }

      logger.info("Education updated", { educationId: education._id });

      res.status(200).json({
        success: true,
        message: "Education updated successfully",
        data: education,
      });
    } catch (error: any) {
      logger.error("Error updating education", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to update education",
        error: error.message,
      });
    }
  }

  // Delete education entry (protected - admin only)
  async deleteEducation(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const education = await EducationModel.findByIdAndDelete(id);

      if (!education) {
        res.status(404).json({
          success: false,
          message: "Education entry not found",
        });
        return;
      }

      logger.info("Education deleted", { educationId: id });

      res.status(200).json({
        success: true,
        message: "Education deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting education", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to delete education",
        error: error.message,
      });
    }
  }
}

export const educationController = new EducationController();
