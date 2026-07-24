import cors from "cors"
// import opportunityController from "./module/Opportunity/opportunity.controller.js"
// import requirementController from "./module/Requirements/requirement.controller.js"
// import requirementFileController from "./module/RequirementFile/requirementFile.controller.js"
// import opportunityAnalysisController from "./module/opportunity-analysis/opportunityAnalysis.controller.js"

import { globalErrorHandler } from "./utils/middleware/globalErrorHandler.js";
import { ApiError } from "./utils/error/errorClass.js";
import { config } from "./config/dev.env.js";
import baseRouter from "./routes/index.js"


export async function bootStrap(app, express) {
    app.use(express.json());
    app.use(cors({ origin: "*" }));
    app.use("/",baseRouter);
    app.get("/",(req,res)=>{
        throw new ApiError(404,"Golbal error + Error class testing");
    })
    //global error handling
    app.use(globalErrorHandler);

    //for any dummy requestes (not handled)
    app.use("/:dummy", (req, res, next) => {
        res.status(404).json({ message: "invalid url" })
    })
}