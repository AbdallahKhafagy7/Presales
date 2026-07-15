import express from "express";
import opportunityRequirementRouter from "./opportunityRequirement.js";
import requirementFileRouter from "./requirementFile.js";
import opportunityAnalysisRouter from "./opportunityAnalysis.js";
import {
  createOpportunity,
  updateOpportunity,
  getAllOpportunities,
  getOpportunity,
  deleteOpportunity,
} from "../controllers/opportunitiesController.js";

const opportunityRouter = express.Router();

// =========== requirements ===========
opportunityRouter.use("/requirements", opportunityRequirementRouter);

// =========== files ===========
opportunityRouter.use("/files", requirementFileRouter);

// =========== analysis ===========
opportunityRouter.use("/analysis", opportunityAnalysisRouter);

// =========== opportunities ===========
opportunityRouter.post("/", createOpportunity);
opportunityRouter.post("/:opportunityId", updateOpportunity);
opportunityRouter.get("/", getAllOpportunities);
opportunityRouter.get("/:opportunityId", getOpportunity);
opportunityRouter.delete("/:opportunityId", deleteOpportunity);

export default opportunityRouter;
