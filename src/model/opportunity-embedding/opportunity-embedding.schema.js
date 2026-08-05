import mongoose from "mongoose";

const opporunityEmbeddingSchema = new mongoose.Schema(
  {
    embedding: {
      type: [Number],
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["technology_catalog", "requirement_analysis", "opportunity"],
    },
    sourceId: String,
    title: String,
    text: String,
    metadata: Object, // same as metadata: {}
    updatedAt: Date,
  },
  { timestamps: true },
);

export default opporunityEmbeddingSchema;
