import mongoose, { Schema, Document, Model } from "mongoose";

// Blog interface extending mongoose Document
export interface IBlog extends Document {
  title: string;
  description: string;
  content: string;
  date: Date;
  readTime: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Schema
const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    readTime: {
      type: String,
      default: "5 min read",
    },
    tags: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
blogSchema.index({ title: "text", description: "text", tags: "text" });
blogSchema.index({ date: -1 });
blogSchema.index({ published: 1 });

// Create and export the model
export const BlogModel: Model<IBlog> = mongoose.model<IBlog>("Blog", blogSchema);

