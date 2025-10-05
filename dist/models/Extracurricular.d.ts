import { Document, Model } from "mongoose";
export interface IExtracurricular extends Document {
    role: string;
    organization: string;
    year: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ExtracurricularModel: Model<IExtracurricular>;
//# sourceMappingURL=Extracurricular.d.ts.map