import cors from "cors";
<<<<<<< HEAD
import { ZodError } from "zod";
import multer from "multer";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import { config } from "./config/dev.env.js";
import baseRouter from "./routes/index.js";

import logger from "./utils/logger.js";
import pinoHttp from "pino-http";
=======

import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import baseRouter from "./routes/index.js";
>>>>>>> hassans-branch

export async function bootStrap(app, express) {
  app.use(express.json());
  app.use(cors({ origin: "*" }));
  app.use(pinoHttp({ logger }));

<<<<<<< HEAD
  app.use("/api", routes);
  //global error handling
  app.use(globalErrorHandler);

  //for any dummy requestes (not handled)
  app.use("/:dummy", (req, res, next) => {
    res.status(404).json({ message: "invalid url" });
=======
  app.use("/api", baseRouter);

  // Handles any URL that did not match a real route
  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid URL"));
>>>>>>> hassans-branch
  });

  // Global error handling must be last
  app.use(globalErrorHandler);
}
