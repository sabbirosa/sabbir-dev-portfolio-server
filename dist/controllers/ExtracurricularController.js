"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extracurricularController = exports.ExtracurricularController = void 0;
const Extracurricular_1 = require("../models/Extracurricular");
const logger_1 = require("../utils/logger");
class ExtracurricularController {
    async getAllExtracurricular(req, res) {
        try {
            const extracurricular = await Extracurricular_1.ExtracurricularModel.find()
                .sort({ order: 1 })
                .select("-__v");
            res.status(200).json({
                success: true,
                count: extracurricular.length,
                data: extracurricular,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching extracurricular", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch extracurricular",
                error: error.message,
            });
        }
    }
    async getExtracurricularById(req, res) {
        try {
            const { id } = req.params;
            const extracurricular = await Extracurricular_1.ExtracurricularModel.findById(id).select("-__v");
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
        }
        catch (error) {
            logger_1.logger.error("Error fetching extracurricular", { error: error.message });
            res.status(500).json({
                success: false,
                message: "Failed to fetch extracurricular",
                error: error.message,
            });
        }
    }
    async createExtracurricular(req, res) {
        try {
            const extracurricularData = req.body;
            if (!extracurricularData.role ||
                !extracurricularData.organization ||
                !extracurricularData.year) {
                res.status(400).json({
                    success: false,
                    message: "Role, organization, and year are required",
                });
                return;
            }
            const extracurricular = await Extracurricular_1.ExtracurricularModel.create(extracurricularData);
            logger_1.logger.info("Extracurricular created", {
                extracurricularId: extracurricular._id,
            });
            res.status(201).json({
                success: true,
                message: "Extracurricular created successfully",
                data: extracurricular,
            });
        }
        catch (error) {
            logger_1.logger.error("Error creating extracurricular", {
                error: error.message,
            });
            res.status(500).json({
                success: false,
                message: "Failed to create extracurricular",
                error: error.message,
            });
        }
    }
    async updateExtracurricular(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const extracurricular = await Extracurricular_1.ExtracurricularModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).select("-__v");
            if (!extracurricular) {
                res.status(404).json({
                    success: false,
                    message: "Extracurricular entry not found",
                });
                return;
            }
            logger_1.logger.info("Extracurricular updated", {
                extracurricularId: extracurricular._id,
            });
            res.status(200).json({
                success: true,
                message: "Extracurricular updated successfully",
                data: extracurricular,
            });
        }
        catch (error) {
            logger_1.logger.error("Error updating extracurricular", {
                error: error.message,
            });
            res.status(500).json({
                success: false,
                message: "Failed to update extracurricular",
                error: error.message,
            });
        }
    }
    async deleteExtracurricular(req, res) {
        try {
            const { id } = req.params;
            const extracurricular = await Extracurricular_1.ExtracurricularModel.findByIdAndDelete(id);
            if (!extracurricular) {
                res.status(404).json({
                    success: false,
                    message: "Extracurricular entry not found",
                });
                return;
            }
            logger_1.logger.info("Extracurricular deleted", { extracurricularId: id });
            res.status(200).json({
                success: true,
                message: "Extracurricular deleted successfully",
            });
        }
        catch (error) {
            logger_1.logger.error("Error deleting extracurricular", {
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
exports.ExtracurricularController = ExtracurricularController;
exports.extracurricularController = new ExtracurricularController();
//# sourceMappingURL=ExtracurricularController.js.map