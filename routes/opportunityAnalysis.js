import express from "express";
import {
  getAnalysis,
  createAnalysis,
} from "../controllers/analysisController.js";

const opportunityAnalysisRouter = express.Router({ mergeParams: true });

opportunityAnalysisRouter.post("/:opportunityId", createAnalysis);
opportunityAnalysisRouter.get("/:opportunityId", getAnalysis);

export default opportunityAnalysisRouter;
