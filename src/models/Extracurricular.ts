import mongoose, { Document, Model, Schema } from "mongoose";

// Extracurricular interface
export interface IExtracurricular extends Document {
  role: string;
  organization: string;
  year: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extracurricular Schema
const extracurricularSchema = new Schema<IExtracurricular>(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, "Organization is required"],
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
extracurricularSchema.index({ order: 1 });

export const ExtracurricularModel: Model<IExtracurricular> =
  mongoose.model<IExtracurricular>("Extracurricular", extracurricularSchema);
