import mongoose, { Schema } from "mongoose";

export const reqAnalysisSchema = new Schema({
    opportunityId: {
        type: mongoose.Types.ObjectId,
        ref: "opportunity",
        required: true,
    },
    executiveSummary: {
        type: [String],
        default: [],
    },
    functionalRequirements: {
        type: [String],
        default: []
    },
    nonFunctionalRequirements: {
        type: [String],
        default: []
    },
    mainModules: {
        type: [String],
        default: []
    },
    externalIntegrations: {
        type: [String],
        default: []
    },
    assumptions: {
        type: [String],
        default: []
    },
    clarificationQuestions: {
        type: [String],
        default: []
    },
    possibleRisks: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft",
    },
}, { timestamps: true });
