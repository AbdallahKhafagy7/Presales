import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";
import redisClient from "../../DB/redisConnection.js";

const chatResetHandler = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      throw new BadRequestError("Session ID is required");
    }
    const redisKey = `chat:history:${sessionId}`;

    const deletedCount = await redisClient.del(redisKey);
    if (deletedCount === 0) {
      throw new NotFoundError("Session not found or already cleared");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { sessionId }, "Chat session reset successfully"),
      );
  } catch (e) {
    next(e);
  }
};

export { chatResetHandler };
