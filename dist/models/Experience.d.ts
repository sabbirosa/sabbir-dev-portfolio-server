import { Document, Model } from "mongoose";
export interface IExperience extends Document {
    position: string;
    company: string;
    year: string;
    description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ExperienceModel: Model<IExperience>;
//# sourceMappingURL=Experience.d.ts.map