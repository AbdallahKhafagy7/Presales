import mongoose from "mongoose";
import technologyStackItemSchema from "./tech-stack-item.schema.js";

const technologyStackRecommendationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      // unique: true, -> each opportunity could have multiple recommendation that are drafted
      index: true,
    },
    techStack: [technologyStackItemSchema],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default mongoose.model(
  "TechnologyStackRecommendation",
  technologyStackRecommendationSchema,
);
