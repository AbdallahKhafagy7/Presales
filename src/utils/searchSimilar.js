import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import buildAggragationPipeline from "./aggregation-pipeline.js";

export default async function searchSimilar(queryEmbedding, filters = {}) {
  const aggregationPipeline = buildAggragationPipeline(queryEmbedding, filters);

  const retrievedContext =
    await opportunityEmbedding.aggregate(aggregationPipeline);

  if (retrievedContext.length === 0) return [];
  return retrievedContext;
}
