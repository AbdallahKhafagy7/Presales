import opportunityEmbedding from "../model/opportunity-embedding/opportunity-embedding.model.js";
import embedText from "./embedText.js";

export default async function replaceVectors(
  sourceType,
  sourceId,
  documents = [],
) {
  if (!sourceType || !sourceId) {
    throw new Error("replaceVectors requires both sourceType and sourceId.");
  }

  // Delete existing vectors for this entity to prevent stale chunks/duplicates
  await opportunityEmbedding.deleteMany({ sourceType, sourceId });

  // Exit early if no documents are provided
  if (!Array.isArray(documents) || documents.length === 0) return [];

  // Map through documents and call embedText on each individual string in parallel
  const vectorDocs = await Promise.all(
    documents.map(async (doc) => {
      const embedding = await embedText(doc.text);

      return {
        embedding,
        sourceType,
        sourceId,
        title: doc.title || "",
        text: doc.text,
        metadata: doc.metadata || {},
      };
    }),
  );

  const createdDocs = await opportunityEmbedding.insertMany(vectorDocs);

  return createdDocs;
}
