import { Document, Model } from "mongoose";
export interface IProject extends Document {
    title: string;
    description: string;
    image: string;
    liveLink: string;
    codeLink?: string;
    year: string;
    techStack: string[];
    challenges: string[];
    improvements: string[];
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProjectModel: Model<IProject>;
//# sourceMappingURL=Project.d.ts.map