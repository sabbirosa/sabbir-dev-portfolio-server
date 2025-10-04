import { Request, Response } from "express";
export declare class HealthController {
    getHealth(req: Request, res: Response): Promise<void>;
    getReadiness(req: Request, res: Response): Promise<void>;
    getLiveness(req: Request, res: Response): Promise<void>;
    private performReadinessChecks;
    private handleError;
}
export declare const healthController: HealthController;
//# sourceMappingURL=HealthController.d.ts.map