import mongoose from "mongoose";
import opporunityEmbeddingSchema from "./opportunity-embedding.schema.js";

export default mongoose.model(
  "OpportunityEmbedding",
  opporunityEmbeddingSchema,
);
