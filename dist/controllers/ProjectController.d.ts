import { Request, Response } from "express";
export declare class ProjectController {
    getAllProjects(req: Request, res: Response): Promise<void>;
    getProjectById(req: Request, res: Response): Promise<void>;
    createProject(req: Request, res: Response): Promise<void>;
    updateProject(req: Request, res: Response): Promise<void>;
    deleteProject(req: Request, res: Response): Promise<void>;
}
export declare const projectController: ProjectController;
//# sourceMappingURL=ProjectController.d.ts.map