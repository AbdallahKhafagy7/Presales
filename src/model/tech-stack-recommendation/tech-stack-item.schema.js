import mongoose from "mongoose";

const technologyStackItemSchema = new mongoose.Schema(
  {
    technologyRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TechnologyCatalog",
      default: null,
    },
    technologyName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    isExternal: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

export default technologyStackItemSchema;
