import retrieveContext from "../utils/contextRetriever.js";
import generateResponse from "../utils/ai.js";
import { chatbotPrompt } from "./systemPrompts.js";

export default async function askChatbot(
  question,
  sourceTypes,
  opportunityId,
  history = [],
) {
  // Retrieve context using question
  const retrievedContext = await retrieveContext(
    question,
    sourceTypes,
    opportunityId,
  );

  // Extract unique sources
  const sourceMap = new Map();
  if (Array.isArray(retrievedContext)) {
    retrievedContext.forEach((doc) => {
      const key = `${doc.sourceType}:${doc.sourceId}`;
      if (!sourceMap.has(key)) {
        sourceMap.set(key, {
          sourceType: doc.sourceType,
          sourceId: doc.sourceId,
          title: doc.title || "Untitled Document",
        });
      }
    });
  }
  const sources = Array.from(sourceMap.values());

  // Generate response
  const prompt = chatbotPrompt(question, retrievedContext, history);
  const response = await generateResponse(prompt);

  return { response, sources };
}
