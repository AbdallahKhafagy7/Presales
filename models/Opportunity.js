import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3,
    },
    clientName: {
      type: String,
      required: true,
      minLength: 2,
    },
    description: String,
    status: {
      type: String,
      default: "new",
      enum: ["new", "in-progress", "ready-for-analysis", "closed"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Opportunity", opportunitySchema);
