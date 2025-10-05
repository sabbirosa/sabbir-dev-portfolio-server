import { Request, Response } from "express";
export declare class EducationController {
    getAllEducation(req: Request, res: Response): Promise<void>;
    getEducationById(req: Request, res: Response): Promise<void>;
    createEducation(req: Request, res: Response): Promise<void>;
    updateEducation(req: Request, res: Response): Promise<void>;
    deleteEducation(req: Request, res: Response): Promise<void>;
}
export declare const educationController: EducationController;
//# sourceMappingURL=EducationController.d.ts.map