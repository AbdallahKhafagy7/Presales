import { Router } from "express";
import * as opportunityController from "../module/opportunity/opportunity.controller.js";
import { validate } from "../utils/middleware/zod.validation.js";
import { createOpportunitySchema, updateOpportunitySchema } from "../module/opportunity/opportunity.validation.js";
import { objectIdvalidateSchema } from "../module/comman/validation.js";

const router = Router();
router.post("/create",validate(createOpportunitySchema),opportunityController.createOpportunity);
router.get("/get-all",opportunityController.getAllOpportunities);
router.get("/view/:id",validate(objectIdvalidateSchema),opportunityController.getOpportunityById)
router.put("/:id", validate(objectIdvalidateSchema), validate(updateOpportunitySchema)
, opportunityController.updateOpportunity);
router.delete("/:id",validate(objectIdvalidateSchema),opportunityController.deleteOpportunity);
export default router;