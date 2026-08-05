export default function buildAggragationPipeline(queryEmbedding, options = {}) {
  const { sourceTypes, opportunityId } = options;

  const vectorSearchStage = {
    $vectorSearch: {
      index: "opportunity_vector_index",
      path: "embedding",
      queryVector: queryEmbedding,
      numCandidates: 10,
      limit: 3,
    },
  };

  const filterConditions = [];

  // 1. Convert sourceTypes into an $in filter condition
  if (sourceTypes && Array.isArray(sourceTypes) && sourceTypes.length > 0) {
    filterConditions.push({
      sourceType: { $in: sourceTypes },
    });
  }

  // 2. Convert opportunityId into the Task 6 rule condition
  // (Matches that opportunity OR global tech catalog docs)
  if (
    opportunityId &&
    typeof opportunityId === "string" &&
    opportunityId.trim() !== ""
  ) {
    filterConditions.push({
      $or: [
        { "metadata.opportunityId": opportunityId },
        { sourceType: "technology_catalog" },
      ],
    });
  }

  // 3. Attach filters to the $vectorSearch stage if any conditions exist
  if (filterConditions.length > 0) {
    vectorSearchStage.$vectorSearch.filter =
      filterConditions.length === 1
        ? filterConditions[0]
        : { $and: filterConditions };
  }

  const aggregationPipeline = [
    vectorSearchStage,
    {
      $project: {
        text: 1,
        title: 1,
        sourceType: 1,
        sourceId: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  return aggregationPipeline;
}
