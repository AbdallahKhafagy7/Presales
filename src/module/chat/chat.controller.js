import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";

import retrieveContext from "../../utils/contextRetriever.js";
import generateResponse from "../../utils/ai.js";
import askChatbot from "../../utils/askChatbot.js";

const chatHandler = async (req, res, next) => {
  try {
    const { question, sourceType, opportunityId } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      throw new BadRequestError("Question string is required");
    }

    const llmResponse = await askChatbot(question, sourceType, opportunityId);
    if (!llmResponse) {
      throw new BadRequestError("Failed to generate response from chatbot");
    }

    const response = new ApiResponse(
      200,
      llmResponse,
      "Response generated successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

export { chatHandler };
