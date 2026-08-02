import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  opportunityId: {
    type: mongoose.Types.ObjectId,
    ref: "opportunity",
    required: true,
    unique: true,
  },
  executiveSummary: {
    type: String,
    required: true,
    trim: true,
  },
  functionalRequirements: {
    type: [String],
    required: true,
    default: [],
  },
  nonFunctionalRequirements: {
    type: [String],
    required: true,
    default: [],
  },
  mainModules: {
    type: [String],
    required: true,
    default: [],
  },
  externalIntegrations: {
    type: [String],
    required: true,
    default: [],
  },
  assumptions: {
    type: [String],
    required: true,
    default: [],
  },
  suggestedClarificationQuestions: {
    type: [String],
    required: true,
    default: [],
  },
  risks: {
    type: [String],
    required: true,
    default: [],
  },
});
