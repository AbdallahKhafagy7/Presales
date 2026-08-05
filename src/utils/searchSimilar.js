import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import buildAggragationPipeline from "./aggregation-pipeline.js";

export default async function searchSimilar(queryEmbedding, options = {}) {
  const aggregationPipeline = buildAggragationPipeline(queryEmbedding, options);

  const retrievedContext =
    await opportunityEmbedding.aggregate(aggregationPipeline);

  if (retrievedContext.length === 0) return [];
  return retrievedContext;
}
