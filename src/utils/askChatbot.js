import retrieveContext from "../utils/contextRetriever.js";
import generateResponse from "../utils/ai.js";
import { chatbotPrompt } from "./systemPrompts.js";

export default async function askChatbot(question, sourceType, opportunityId) {
  const retrievedContext = await retrieveContext(
    question,
    sourceType,
    opportunityId,
  );

  const prompt = chatbotPrompt(question, retrievedContext);

  const response = await generateResponse(prompt);
  return response;
}
