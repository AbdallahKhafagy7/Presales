import express from "express";
const router = express.Router();

router.post("/:opportunityId/analysis", createAnalysis);

router.get("/:opportunityId/analysis", getAnalysis);

export default router;
