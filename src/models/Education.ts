import mongoose, { Document, Model, Schema } from "mongoose";

// Education interface
export interface IEducation extends Document {
  degree: string;
  institution: string;
  year: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Education Schema
const educationSchema = new Schema<IEducation>(
  {
    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, "Institution is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
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
educationSchema.index({ order: 1 });

export const EducationModel: Model<IEducation> = mongoose.model<IEducation>(
  "Education",
  educationSchema
);
