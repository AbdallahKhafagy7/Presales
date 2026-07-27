import cors from "cors";

import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import baseRouter from "./routes/index.js";

export async function bootStrap(app, express) {
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.use("/api", baseRouter);

  // Handles any URL that did not match a real route
  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid URL"));
  });

  // Global error handling must be last
  app.use(globalErrorHandler);
}
