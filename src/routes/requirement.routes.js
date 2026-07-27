import express from "express";
import {
  createRequirement,
  getRequirement,
  deleteRequirement,
} from "../module/opportunity-requirements/opportunity-requirements.controller.js";

const router = express.Router();
router.post("/:opportunityId", createRequirement);
router.get("/:opportunityId", getRequirement);
router.delete("/:opportunityId", deleteRequirement);

export default router;
