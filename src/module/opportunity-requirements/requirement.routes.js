import express from "express";
const router = express.Router();

router.post("/:opportunityId", addRequirement);

router.get("/:opportunityId", getRequirement);

router.delete("/:opportunityId", deleteRequirement);

export default router;
