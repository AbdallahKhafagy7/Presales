import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import embedText from "./embedText.js";

export default async function replaceVectors(sourceType, sourceId, documents) {
  const newEmbedding = await embedText(documents);

  const obj = await opportunityEmbedding.findOne({ sourceId, sourceType });
  obj.embedding = newEmbedding;
  await obj.save();

  return obj;
}
