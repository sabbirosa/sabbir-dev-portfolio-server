import { Request, Response } from "express";
export declare class ExperienceController {
    getAllExperience(req: Request, res: Response): Promise<void>;
    getExperienceById(req: Request, res: Response): Promise<void>;
    createExperience(req: Request, res: Response): Promise<void>;
    updateExperience(req: Request, res: Response): Promise<void>;
    deleteExperience(req: Request, res: Response): Promise<void>;
}
export declare const experienceController: ExperienceController;
//# sourceMappingURL=ExperienceController.d.ts.map