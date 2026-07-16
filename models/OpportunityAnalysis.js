import mongoose from "mongoose";

const opportunityAnalysisSchema = mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    mainFeatures: {
      type: [String],
    },
    technicalNeeds: {
      type: [String],
    },
    risks: {
      type: [String],
    },
    questions: {
      type: [String],
    },
    complexity: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    analyzedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// compound index -> better preformance
// 1 means ascending order for the ID, -1 means descending order for the date
opportunityAnalysisSchema.index({ opportunityId: 1, analyzedAt: -1 });

export default mongoose.model("OpportunityAnalysis", opportunityAnalysisSchema);
