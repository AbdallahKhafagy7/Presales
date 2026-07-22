const express = require("express");
const router = express.Router();

const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");

router.post("/", createOpportunity);

router.get("/", getOpportunities);

router.get("/:id", getOpportunityById);

router.put("/:id", updateOpportunity);

router.delete("/:id", deleteOpportunity);

export default router;
