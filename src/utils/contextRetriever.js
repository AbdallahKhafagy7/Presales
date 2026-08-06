import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import embedText from "./embedText.js";
import searchSimilar from "./searchSimilar.js";

export default async function retrieveContext(
  question,
  sourceTypes,
  opportunityId,
) {
  const queryEmbedding = await embedText(question);
  const options = { sourceTypes, opportunityId };

  const retrievedContext = await searchSimilar(queryEmbedding, options);

  return retrievedContext;
}
