import { Router } from "express";
import * as requirementAnalysisController from "../module/requriement-analysis/requriementAnalysis.controller.js"
import { validate } from "../utils/middleware/zod.validation.js";
import { objectIdvalidateSchema } from "../module/comman/validation.js";
const router = Router();
router.get("/:id/requirement-analysis/context", validate(objectIdvalidateSchema), requirementAnalysisController.analysisContext);
router.get("/:id/requirement-analysis/opportunity", validate(objectIdvalidateSchema), requirementAnalysisController.getOpportunity);
router.post("/:id/requirement-analysis/generate", validate(objectIdvalidateSchema), requirementAnalysisController.generateAnalysis);
router.post("/:id/requirement-analysis/save", validate(objectIdvalidateSchema), requirementAnalysisController.saveAnalysis);
router.get("/:id/requirement-analysis/analysis", validate(objectIdvalidateSchema), requirementAnalysisController.getAnalysis);
export default router;