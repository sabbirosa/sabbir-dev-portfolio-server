import mongoose, { Document, Model, Schema } from "mongoose";

// Project interface extending mongoose Document
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

// Project Schema
const projectSchema = new Schema<IProject>(
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
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    liveLink: {
      type: String,
      required: [true, "Live link is required"],
    },
    codeLink: {
      type: String,
      default: null,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    techStack: {
      type: [String],
      default: [],
      required: [true, "Tech stack is required"],
    },
    challenges: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
projectSchema.index({ title: "text", description: "text" });
projectSchema.index({ featured: 1, order: 1 });
projectSchema.index({ year: -1 });

// Create and export the model
export const ProjectModel: Model<IProject> = mongoose.model<IProject>(
  "Project",
  projectSchema
);
