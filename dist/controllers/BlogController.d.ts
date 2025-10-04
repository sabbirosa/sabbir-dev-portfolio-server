import { Request, Response } from "express";
export declare class BlogController {
    getAllBlogs(req: Request, res: Response): Promise<void>;
    getBlogById(req: Request, res: Response): Promise<void>;
    createBlog(req: Request, res: Response): Promise<void>;
    updateBlog(req: Request, res: Response): Promise<void>;
    deleteBlog(req: Request, res: Response): Promise<void>;
}
export declare const blogController: BlogController;
//# sourceMappingURL=BlogController.d.ts.map