import { getClient } from "./ai.js";

export default async function embedText(text) {
  const client = getClient();

  const embeddingResponse = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    dimensions: 512, // Optional but recommended for consistent setup
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;
  return queryEmbedding || [];
}
