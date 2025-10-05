import mongoose, { Document, Model, Schema } from "mongoose";

// Experience interface
export interface IExperience extends Document {
  position: string;
  company: string;
  year: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Experience Schema
const experienceSchema = new Schema<IExperience>(
  {
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
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

// Create index for ordering
experienceSchema.index({ order: 1 });

export const ExperienceModel: Model<IExperience> = mongoose.model<IExperience>(
  "Experience",
  experienceSchema
);
