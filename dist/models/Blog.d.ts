import { Document, Model } from "mongoose";
export interface IBlog extends Document {
    title: string;
    description: string;
    content: string;
    featuredImage?: string;
    date: Date;
    readTime: string;
    tags: string[];
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BlogModel: Model<IBlog>;
//# sourceMappingURL=Blog.d.ts.map