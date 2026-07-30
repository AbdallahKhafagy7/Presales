import mongoose from "mongoose";

export const technologyCatalogSchema = new mongoose.Schema({
  technologyName: {
    required: true,
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Frontend",
      "Backend",
      "Mobile",
      "Database",
      "DevOps",
      "Cloud",
      "AI",
      "Testing",
      "CMS",
      "E-commerce",
    ],
  },
  preferredUsecase: {
    type: String,
    required: true,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});
