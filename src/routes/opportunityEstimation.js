import { Router } from "express";
import * as estimationController from "../module/opportunity-estimation/opportunityEstimation.controller.js"
import { validate } from "../utils/middleware/zod.validation.js";
import { objectIdvalidateSchema } from "../module/comman/validation.js";
const router = new Router();
router.get("/:id/estimations/opportunity",
    validate(objectIdvalidateSchema),
    estimationController.getOpportunity
);
router.get("/:id/estimations/context",
    validate(objectIdvalidateSchema),
    estimationController.getContext
)
router.post("/:id/estimations/generate",
    validate(objectIdvalidateSchema),
    estimationController.generateEstimation)
export default router;