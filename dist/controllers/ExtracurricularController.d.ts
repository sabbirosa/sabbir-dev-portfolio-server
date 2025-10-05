import { Request, Response } from "express";
export declare class ExtracurricularController {
    getAllExtracurricular(req: Request, res: Response): Promise<void>;
    getExtracurricularById(req: Request, res: Response): Promise<void>;
    createExtracurricular(req: Request, res: Response): Promise<void>;
    updateExtracurricular(req: Request, res: Response): Promise<void>;
    deleteExtracurricular(req: Request, res: Response): Promise<void>;
}
export declare const extracurricularController: ExtracurricularController;
//# sourceMappingURL=ExtracurricularController.d.ts.map