import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["answered", "unanswered"],
      default: "unanswered",
    },
  },
  {
    timestamps: true,
  },
);

const assumptionSchema = new mongoose.Schema(
  {
    assumption: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const clarificationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      unique: true,
    },

    questions: {
      type: [questionSchema],
      default: [],
    },

    assumptions: {
      type: [assumptionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
