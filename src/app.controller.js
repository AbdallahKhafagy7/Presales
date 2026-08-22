import cors from "cors";
import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import baseRouter from "./routes/index.js";

export async function bootStrap(app, express) {
  app.use(express.json());
  app.use(cors({ origin: "*", exposedHeaders: ["Content-Disposition"] }));

  app.use("/api", baseRouter);

  app.use((req, res, next) => {
    next(new ApiError(404, "Invalid URL"));
  });

  //global error handling
  app.use(globalErrorHandler);
}
