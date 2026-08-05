export default function buildAggragationPipeline(queryEmbedding, filters = {}) {
  const vectorSearchStage = {
    $vectorSearch: {
      index: "opportunity_vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 10,
      limit: 3,
    },
  };

  // Add the filtering conditions if any are provided
  if (Object.keys(filters).length > 0) {
    vectorSearchStage.$vectorSearch.filter = filters;
  }

  const aggregationPipeline = [
    vectorSearchStage,
    {
      $project: {
        text: 1,
        title: 1,
        sourceType: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
        // Excluding embedding array to save bandwidth & boost speed
        embedding: 0,
      },
    },
  ];

  return aggregationPipeline;
}
