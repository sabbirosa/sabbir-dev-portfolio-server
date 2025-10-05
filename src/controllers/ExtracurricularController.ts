import { Request, Response } from "express";
import { ExtracurricularModel } from "../models/Extracurricular";
import { logger } from "../utils/logger";

export class ExtracurricularController {
  // Get all extracurricular entries (public)
  async getAllExtracurricular(req: Request, res: Response): Promise<void> {
    try {
      const extracurricular = await ExtracurricularModel.find()
        .sort({ order: 1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        count: extracurricular.length,
        data: extracurricular,
      });
    } catch (error: any) {
      logger.error("Error fetching extracurricular", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch extracurricular",
        error: error.message,
      });
    }
  }

  // Get single extracurricular entry (public)
  async getExtracurricularById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const extracurricular = await ExtracurricularModel.findById(id).select(
        "-__v"
      );

      if (!extracurricular) {
        res.status(404).json({
          success: false,
          message: "Extracurricular entry not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: extracurricular,
      });
    } catch (error: any) {
      logger.error("Error fetching extracurricular", { error: error.message });
      res.status(500).json({
        success: false,
        message: "Failed to fetch extracurricular",
        error: error.message,
      });
    }
  }

  // Create extracurricular entry (protected - admin only)
  async createExtracurricular(req: Request, res: Response): Promise<void> {
    try {
      const extracurricularData = req.body;

      if (
        !extracurricularData.role ||
        !extracurricularData.organization ||
        !extracurricularData.year
      ) {
        res.status(400).json({
          success: false,
          message: "Role, organization, and year are required",
        });
        return;
      }

      const extracurricular = await ExtracurricularModel.create(
        extracurricularData
      );
      logger.info("Extracurricular created", {
        extracurricularId: extracurricular._id,
      });

      res.status(201).json({
        success: true,
        message: "Extracurricular created successfully",
        data: extracurricular,
      });
    } catch (error: any) {
      logger.error("Error creating extracurricular", {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to create extracurricular",
        error: error.message,
      });
    }
  }

  // Update extracurricular entry (protected - admin only)
  async updateExtracurricular(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const extracurricular = await ExtracurricularModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select("-__v");

      if (!extracurricular) {
        res.status(404).json({
          success: false,
          message: "Extracurricular entry not found",
        });
        return;
      }

      logger.info("Extracurricular updated", {
        extracurricularId: extracurricular._id,
      });

      res.status(200).json({
        success: true,
        message: "Extracurricular updated successfully",
        data: extracurricular,
      });
    } catch (error: any) {
      logger.error("Error updating extracurricular", {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to update extracurricular",
        error: error.message,
      });
    }
  }

  // Delete extracurricular entry (protected - admin only)
  async deleteExtracurricular(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const extracurricular = await ExtracurricularModel.findByIdAndDelete(id);

      if (!extracurricular) {
        res.status(404).json({
          success: false,
          message: "Extracurricular entry not found",
        });
        return;
      }

      logger.info("Extracurricular deleted", { extracurricularId: id });

      res.status(200).json({
        success: true,
        message: "Extracurricular deleted successfully",
      });
    } catch (error: any) {
      logger.error("Error deleting extracurricular", {
        error: error.message,
      });
      res.status(500).json({
        success: false,
        message: "Failed to delete extracurricular",
        error: error.message,
      });
    }
  }
}

export const extracurricularController = new ExtracurricularController();
