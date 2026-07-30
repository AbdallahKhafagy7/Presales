
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

export function generateReqAnalysisPrompt(
  opportunity,
  recommendedTechnologies,
  filesContent,
  requirementsText
) {
  return `You are a Senior Business Analyst and Solution Architect.
Your task is to analyze the provided opportunity requirements and generate a structured requirement analysis.

The output should be professional, concise, and suitable for saving directly into a Requirement Analysis document.

Use ONLY the information provided below.
Do not invent business requirements or integrations that are not reasonably implied.
If information is missing, state it as an assumption, clarification question, or potential risk instead of making it up.

=========================
OPPORTUNITY
=========================
Project Name:
${opportunity.projectName}

Client:
${opportunity.clientName}

Industry:
${opportunity.industry}

Description:
${opportunity.description ?? "Not provided"}

Notes:
${opportunity.notes ?? "None"}

=========================
REQUIREMENTS TEXT
=========================
${requirementsText || "No requirements provided."}

=========================
ATTACHED REQUIREMENT FILES
=========================
${filesContent || "No files attached."}

=========================
TECHNOLOGY CATALOGUE
=========================
${recommendedTechnologies || "Not provided."}

=========================
TASK
=========================

Analyze all available information and produce the following sections:

1. Executive Summary
- Summarize the business objective.
- Mention the expected solution.
- Mention important technologies only if explicitly stated.

2. Functional Requirements
Return an array of concise functional requirements.

3. Non-Functional Requirements
Identify performance, security, scalability, compliance, usability, availability, accessibility, localization, and reliability requirements.

4. Main Modules
Identify the major application modules or features.

5. External Integrations
List all external systems, APIs, cloud services, authentication providers, payment gateways, ERPs, CRMs, messaging services, etc.

6. Assumptions
List assumptions only when information is missing but required for implementation.

7. Suggested Clarification Questions
Generate questions that should be asked to the client before development starts.

8. Possible Risks
Identify project, business, technical, integration, security, or timeline risks.

=========================
OUTPUT FORMAT
=========================

Return ONLY valid JSON.

{
  "executiveSummary": "",
  "functionalRequirements": [],
  "nonFunctionalRequirements": [],
  "mainModules": [],
  "externalIntegrations": [],
  "assumptions": [],
  "clarificationQuestions": [],
  "possibleRisks": []
}

Do not wrap the JSON in markdown.
Do not include explanations outside the JSON.
`;
}
export { technologyStackRecommendationPrompt };
