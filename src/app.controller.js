import cors from "cors";
import { ZodError } from "zod";
import multer from "multer";
import { BadRequestError } from "./utils/error/index.js";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import { config } from "./config/dev.env.js";
import baseRouter from "./routes/index.js"


export async function bootStrap(app, express) {
  app.use(express.json());
  app.use(cors({ origin: "*" }));

  app.use("/api", routes);
  //global error handling
  app.use(globalErrorHandler);

  //for any dummy requestes (not handled)
  app.use("/:dummy", (req, res, next) => {
    res.status(404).json({ message: "invalid url" });
  });
}



export async function bootStrap(app, express) {
    app.use(express.json());
    app.use(cors({ origin: "*" }));
    app.use("/",baseRouter);
    app.get("/",(req,res)=>{
        throw new ApiError(404,"Golbal error + Error class testing");
    })


    //for any dummy requestes (not handled)
    app.use("/:dummy", (req, res, next) => {
        res.status(404).json({ message: "invalid url" })
    })
}
