import cors from "cors";
import { ZodError } from "zod";
import multer from "multer";
import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import { config } from "./config/dev.env.js";
import baseRouter from "./routes/index.js";

import logger from "./utils/logger.js";
import pinoHttp from "pino-http";

export async function bootStrap(app, express) {
  app.use(express.json());
  app.use(cors({ origin: "*" }));
  app.use(pinoHttp({ logger }));

  app.use("/api", baseRouter);

  //for any dummy requestes (not handled)
  /*app.use("/:dummy", (req, res, next) => {
    res.status(404).json({ message: "invalid url" });
  });*/

  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid URL"));
  });

  //global error handling
  app.use(globalErrorHandler);
}
