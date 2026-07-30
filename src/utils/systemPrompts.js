const technologyStackRecommendationPrompt = (
  projectRequirement,
  technologyStack,
) => {
  return `You are an expert Enterprise Software Architect. Your task is to analyze project requirements and recommend a suitable technology stack based on a provided Company Technology Catalog.

### INSTRUCTIONS:
1. Carefully review the PROJECT REQUIREMENTS and the COMPANY TECHNOLOGY CATALOG.
2. Prefer technologies from the COMPANY TECHNOLOGY CATALOG whenever they satisfy the requirements.
3. For catalog items:
   - Set isExternal to false.
   - Set technologyRef to their exact _id from the catalog.
   - Set technologyName to the exact technologyName from the catalog.
   - Write a clear reason.
4. If a critical architectural need cannot be met by the catalog:
   - Set isExternal to true.
   - Set technologyRef to null.
   - Set technologyName to the external tool's standard name.
   - Provide a compelling reason explaining why an external tool is required.
5. Return ONLY a single JSON object matching the strictly formatted schema below.
---

### OUTPUT JSON SCHEMA:
{
  "techStack": [
    {
      "technologyRef": "string or null (24-character hex ObjectId from catalog if isExternal is false)",
      "technologyName": "string or null (Name of the external tool if isExternal is true)",
      "category": "string (e.g. Frontend, Backend, Database, Cloud, DevOps, Testing, Security)",
      "reason": "string (Why this technology was chosen for these specific requirements)",
      "isExternal": "boolean"
    }
  ]
}

---

### COMPANY TECHNOLOGY CATALOG (JSON):
${technologyStack}

### PROJECT REQUIREMENTS:
${projectRequirement}`;
};

export { technologyStackRecommendationPrompt };
