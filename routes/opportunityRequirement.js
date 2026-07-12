import express from "express";
import {
  createRequirement,
  getRequirement,
  deleteRequirement,
} from "../controllers/requirementsController.js";

const opportunityRequirementRouter = express.Router({ mergeParams: true });

opportunityRequirementRouter.post("/:opportunityId", createRequirement);
opportunityRequirementRouter.get("/:opportunityId", getRequirement);
opportunityRequirementRouter.delete("/:opportunityId", deleteRequirement);

export default opportunityRequirementRouter;
