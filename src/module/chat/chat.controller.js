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
    const { question, sourceTypes, opportunityId } = req.body;
    if (!question || typeof question !== "string" || !question.trim()) {
      throw new BadRequestError("Question string is required");
    }

    const { response, sources } = await askChatbot(
      question,
      sourceTypes,
      opportunityId,
    );
    if (!response) {
      throw new BadRequestError("Failed to generate response from chatbot");
    }

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
