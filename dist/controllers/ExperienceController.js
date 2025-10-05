"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experienceController = exports.ExperienceController = void 0;
const Experience_1 = require("../models/Experience");
const logger_1 = require("../utils/logger");
class ExperienceController {
    async getAllExperience(req, res) {
        try {
            const experience = await Experience_1.ExperienceModel.find()
                .sort({ order: 1 })
                .select("-__v");
            res.status(200).json({
                success: true,
                count: experience.length,
                data: experience,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching experience", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch experience",
                error: error.message,
            });
        }
    }
    async getExperienceById(req, res) {
        try {
            const { id } = req.params;
            const experience = await Experience_1.ExperienceModel.findById(id).select("-__v");
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
        }
        catch (error) {
            logger_1.logger.error("Error fetching experience", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch experience",
                error: error.message,
            });
        }
    }
    async createExperience(req, res) {
        try {
            const experienceData = req.body;
            if (!experienceData.position ||
                !experienceData.company ||
                !experienceData.year) {
                res.status(400).json({
                    success: false,
                    message: "Position, company, and year are required",
                });
                return;
            }
            const experience = await Experience_1.ExperienceModel.create(experienceData);
            logger_1.logger.info("Experience created", { experienceId: experience._id });
            res.status(201).json({
                success: true,
                message: "Experience created successfully",
                data: experience,
            });
        }
        catch (error) {
            logger_1.logger.error("Error creating experience", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to create experience",
                error: error.message,
            });
        }
    }
    async updateExperience(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const experience = await Experience_1.ExperienceModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-__v");
            if (!experience) {
                res.status(404).json({
                    success: false,
                    message: "Experience entry not found",
                });
                return;
            }
            logger_1.logger.info("Experience updated", { experienceId: experience._id });
            res.status(200).json({
                success: true,
                message: "Experience updated successfully",
                data: experience,
            });
        }
        catch (error) {
            logger_1.logger.error("Error updating experience", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to update experience",
                error: error.message,
            });
        }
    }
    async deleteExperience(req, res) {
        try {
            const { id } = req.params;
            const experience = await Experience_1.ExperienceModel.findByIdAndDelete(id);
            if (!experience) {
                res.status(404).json({
                    success: false,
                    message: "Experience entry not found",
                });
                return;
            }
            logger_1.logger.info("Experience deleted", { experienceId: id });
            res.status(200).json({
                success: true,
                message: "Experience deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting experience", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to delete experience",
                error: error.message,
            });
        }
    }
}
exports.ExperienceController = ExperienceController;
exports.experienceController = new ExperienceController();
//# sourceMappingURL=ExperienceController.js.map