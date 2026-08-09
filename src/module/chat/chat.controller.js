import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";
import redisClient from "../../DB/redisConnection.js";

import retrieveContext from "../../utils/contextRetriever.js";
import generateResponse from "../../utils/ai.js";
import askChatbot from "../../utils/askChatbot.js";

const CHAT_TTL = 60 * 60 * 24; // Keep chat memory in Redis for 24 hours (in seconds)

const chatHandler = async (req, res, next) => {
  try {
    const { sessionId, data: { question, sourceTypes, opportunityId } = {} } =
      req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      throw new BadRequestError("Question string is required");
    }

    if (!sessionId) {
      throw new BadRequestError("Session ID is required");
    }
    const redisKey = `chat:history:${sessionId}`;

    // get conversation history from sessionId
    const rawHistory = await redisClient.get(redisKey);
    const history = rawHistory ? JSON.parse(rawHistory) : [];

    // get response from chatbot
    const { response, sources } = await askChatbot(
      question,
      sourceTypes,
      opportunityId,
      history,
    );
    if (!response) {
      throw new BadRequestError("Failed to generate response from chatbot");
    }

    // update redis history
    const updatedHistory = [
      ...history,
      { role: "user", content: question.trim() },
      { role: "assistant", content: response },
    ];
    await redisClient.set(
      redisKey,
      JSON.stringify(updatedHistory),
      "EX",
      CHAT_TTL,
    );

    const responseObj = {
      answer: response,
      sources,
    };
    const r = new ApiResponse(
      200,
      responseObj,
      "Response generated successfully",
    );
    return res.status(r.statusCode).json(r);
  } catch (e) {
    next(e);
  }
};

export { chatHandler };
