import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import embedText from "./embedText.js";
import searchSimilar from "./searchSimilar.js";

export default async function retrieveContext(
  question,
  sourceType,
  opportunityId,
) {
  const queryEmbedding = await embedText(question);

  const filters = {};
  if (sourceType) {
    filters.sourceType = sourceType;
  }
  if (opportunityId) {
    filters["metadata.opportunityId"] = opportunityId;
  }

  const retrievedContext = await searchSimilar(queryEmbedding, filters);

  return retrievedContext;
}
