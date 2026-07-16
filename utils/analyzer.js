import generateResponse from "./ai.js";

function createPrompt(inputs) {
  // 1. Define the core instructions and JSON schema for the AI
  const systemInstruction = `
    You are a professional presales analyzer. 
    Analyze the provided client requirements and any attached files, then generate a structured analysis.

    CRITICAL: Your response must contain ONLY a valid JSON object. Do not include any conversational text, markdown formatting blocks (like \`\`\`json), or explanations outside of the JSON.

    ### JSON Schema Requirements:
    - "summary": (String) Required. A short summary of the client requirements.
    - "mainFeatures": (Array of Strings) The main features requested by the client.
    - "technicalNeeds": (Array of Strings) Possible technical needs or system components.
    - "risks": (Array of Strings) Risks, unclear points, or missing information.
    - "questions": (Array of Strings) Strategic questions that should be asked to the client.
    - "complexity": (String) Allowed values: "low", "medium", or "high".

    ### Example Output:
    {
      "summary": "The client needs a CRM system to manage customers, sales opportunities, reporting, access control, and ERP integration.",
      "mainFeatures": [
        "Customer management",
        "Sales pipeline tracking",
        "Reporting dashboards",
        "Role-based access",
        "ERP integration"
      ],
      "technicalNeeds": [
        "Backend APIs",
        "Database design",
        "Authentication and authorization",
        "Integration with external ERP system",
        "Reporting module"
      ],
      "risks": [
        "ERP integration details are not clear",
        "Required user roles are not fully defined",
        "Reporting requirements need more clarification"
      ],
      "questions": [
        "Which ERP system should be integrated?",
        "What user roles should the system support?",
        "Are the reports fixed or customizable?",
        "Is there a preferred technology stack?"
      ],
      "complexity": "medium"
    }`;

  // 2. Safely construct the user input section using your new database structure
  let userInput = `\n\n### Input Data to Analyze:\n`;

  // Append the text requirement if it exists
  if (inputs["requirement"]) {
    userInput += `Client Requirement Text:\n"""\n${inputs["requirement"]}\n"""\n`;
  }

  // Safely loop through your parsedFiles array
  if (inputs["files"] && Array.isArray(inputs["files"])) {
    userInput += `\nAttached Files:\n`;
    for (const file of inputs["files"]) {
      // Maps directly to the originalName and data properties from your backend code
      const fileName = file.originalName || "Unnamed File";
      const fileContent = file.data || "";

      userInput += `--- Start of File: ${fileName} ---\n${fileContent}\n--- End of File ---\n\n`;
    }
  }

  return `${systemInstruction}${userInput}`;
}

async function analyzer(inputs) {
  const prompt = createPrompt(inputs);

  const response = await generateResponse(prompt);

  return JSON.parse(response);
}

export default analyzer;
