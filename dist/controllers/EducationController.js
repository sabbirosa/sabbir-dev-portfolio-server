"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.educationController = exports.EducationController = void 0;
const Education_1 = require("../models/Education");
const logger_1 = require("../utils/logger");
class EducationController {
    async getAllEducation(req, res) {
        try {
            const education = await Education_1.EducationModel.find()
                .sort({ order: 1 })
                .select("-__v");
            res.status(200).json({
                success: true,
                count: education.length,
                data: education,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching education", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch education",
                error: error.message,
            });
        }
    }
    async getEducationById(req, res) {
        try {
            const { id } = req.params;
            const education = await Education_1.EducationModel.findById(id).select("-__v");
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
        }
        catch (error) {
            logger_1.logger.error("Error fetching education", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch education",
                error: error.message,
            });
        }
    }
    async createEducation(req, res) {
        try {
            const educationData = req.body;
            if (!educationData.degree ||
                !educationData.institution ||
                !educationData.year) {
                res.status(400).json({
                    success: false,
                    message: "Degree, institution, and year are required",
                });
                return;
            }
            const education = await Education_1.EducationModel.create(educationData);
            logger_1.logger.info("Education created", { educationId: education._id });
            res.status(201).json({
                success: true,
                message: "Education created successfully",
                data: education,
            });
        }
        catch (error) {
            logger_1.logger.error("Error creating education", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to create education",
                error: error.message,
            });
        }
    }
    async updateEducation(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const education = await Education_1.EducationModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-__v");
            if (!education) {
                res.status(404).json({
                    success: false,
                    message: "Education entry not found",
                });
                return;
            }
            logger_1.logger.info("Education updated", { educationId: education._id });
            res.status(200).json({
                success: true,
                message: "Education updated successfully",
                data: education,
            });
        }
        catch (error) {
            logger_1.logger.error("Error updating education", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to update education",
                error: error.message,
            });
        }
    }
    async deleteEducation(req, res) {
        try {
            const { id } = req.params;
            const education = await Education_1.EducationModel.findByIdAndDelete(id);
            if (!education) {
                res.status(404).json({
                    success: false,
                    message: "Education entry not found",
                });
                return;
            }
            logger_1.logger.info("Education deleted", { educationId: id });
            res.status(200).json({
                success: true,
                message: "Education deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting education", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to delete education",
                error: error.message,
            });
        }
    }
}
exports.EducationController = EducationController;
exports.educationController = new EducationController();
//# sourceMappingURL=EducationController.js.map