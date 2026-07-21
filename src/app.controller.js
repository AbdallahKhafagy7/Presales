import cors from "cors"
// import opportunityController from "./module/Opportunity/opportunity.controller.js"
// import requirementController from "./module/Requirements/requirement.controller.js"
// import requirementFileController from "./module/RequirementFile/requirementFile.controller.js"
// import opportunityAnalysisController from "./module/opportunity-analysis/opportunityAnalysis.controller.js"
import { ZodError } from "zod";
import multer from "multer";
import { BadRequestError } from "./utils/error/index.js"


export async function bootStrap(app, express) {
    app.use(express.json());
    app.use(cors({ origin: "*" }));
    // app.use("/opportunity", opportunityController);
    // app.use("/opportunities", opportunityAnalysisController)
    // app.use("/requirement", requirementController);
    // app.use("/requirement-file", requirementFileController);

    //global error handling
    app.use((err, req, res, next) => {
        if (
            err instanceof multer.MulterError
        ) {
            switch (err.code) {
                case "LIMIT_FILE_SIZE":
                    return res.status(400).json({
                        message:
                            "File size must not exceed 5 MB",
                    });
            }
        }
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: err.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }
        res.status(err.statusCode || 500).json({
            message: err.message || "Something went wrong",
        });
    }
    );
    //for any dummy requestes (not handled)
    app.use("/:dummy", (req, res, next) => {
        res.status(404).json({ message: "invalid url" })
    })
}