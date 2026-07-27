import { Router } from "express";
import * as opportunityController from "./opportunity.controller.js";
import { validate } from "../../utils/middleware/zod.validation.js";
import {
  createOpportunitySchema,
  updateOpportunitySchema,
} from "./opportunity.validation.js";
import { objectIdvalidateSchema } from "../comman/validation.js";

const router = Router();
router.post(
  "/create",
  validate(createOpportunitySchema),
  opportunityController.createOpportunity,
);
router.get("/get-all", opportunityController.getAllOpportunities);
router.get(
  "/view/:id",
  validate(objectIdvalidateSchema),
  opportunityController.getOpportunityById,
);
router.put(
  "/:id",
  validate(objectIdvalidateSchema),
  validate(updateOpportunitySchema),
  opportunityController.updateOpportunity,
);
router.delete(
  "/:id",
  validate(objectIdvalidateSchema),
  opportunityController.deleteOpportunity,
);
export default router;
