import express from "express";
const router = express.Router();

router.post("/", createOpportunity);

router.get("/", getOpportunities);

router.get("/:id", getOpportunityById);

router.put("/:id", updateOpportunity);

router.delete("/:id", deleteOpportunity);

export default router;
