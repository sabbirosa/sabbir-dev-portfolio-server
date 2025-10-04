import { Document, Model } from "mongoose";
export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const UserModel: Model<IUser>;
//# sourceMappingURL=User.mongoose.d.ts.map