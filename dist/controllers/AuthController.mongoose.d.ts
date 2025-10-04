import { Request, Response } from "express";
export declare class AuthController {
    login(req: Request, res: Response): Promise<void>;
    verify(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    getCredentials(req: Request, res: Response): Promise<void>;
    getProfile(req: Request, res: Response): Promise<void>;
    private handleError;
}
export declare const authController: AuthController;
//# sourceMappingURL=AuthController.mongoose.d.ts.map