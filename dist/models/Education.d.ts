import { Document, Model } from "mongoose";
export interface IEducation extends Document {
    degree: string;
    institution: string;
    year: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EducationModel: Model<IEducation>;
//# sourceMappingURL=Education.d.ts.map