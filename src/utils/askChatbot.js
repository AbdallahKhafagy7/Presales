import retrieveContext from "../utils/contextRetriever.js";
import generateResponse from "../utils/ai.js";
import { chatbotPrompt } from "./systemPrompts.js";
import { needsRetrievalPrompt } from "./systemPrompts.js";

async function needsRetrieval(question, history = []) {
  const historyText =
    Array.isArray(history) && history.length > 0
      ? history
          .slice(-4)
          .map(
            (turn) =>
              `${turn.role === "user" ? "User" : "Assistant"}: ${turn.content}`,
          )
          .join("\n")
      : "None";

  const prompt = needsRetrievalPrompt(historyText, question);

  try {
    const result = await generateResponse(prompt);

    return (
      result.trim().toUpperCase().startsWith("RETRIEVE") &&
      !result.trim().toUpperCase().startsWith("NO_RETRIEVE")
    );
  } catch (err) {
    console.error("Intent classification failed, defaulting to retrieve:", err);
    return true;
  }
}

export default async function askChatbot(
  question,
  sourceTypes,
  opportunityId,
  history = [],
) {
  // Retrieve context using question
  const shouldRetrieve = await needsRetrieval(question, history);
  const retrievedContext = shouldRetrieve
    ? await retrieveContext(question, sourceTypes, opportunityId)
    : [];

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
