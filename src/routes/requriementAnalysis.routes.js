import { Router } from "express";
import * as requirementAnalysisController from "../module/requriement-analysis/requriementAnalysis.controller.js"
const router = Router();
router.get("/:id/requirement-analysis/context", requirementAnalysisController.analysisContext);
router.get("/:id/requirement-analysis/opportunity", requirementAnalysisController.getOpportunity);
router.post("/:id/requirement-analysis/generate",requirementAnalysisController.generateAnalysis);
export default router;