import { Router } from "express";
import * as opportunityController from "../module/opportunity/opportunity.controller.js";
import { validate } from "../utils/middleware/zod.validation.js";
import { createOpportunitySchema } from "../module/opportunity/opportunity.validation.js";

const router = Router();
router.post("/create",validate(createOpportunitySchema),opportunityController.createOpportunity);
router.get("/get-all",opportunityController.getAllOpportunities);
export default router;