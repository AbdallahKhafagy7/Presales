const express = require("express");
const router = express.Router();

const { createAnalysis, getAnalysis } = require("../controllers/aiAnalysis");

router.post("/:opportunityId/analysis", createAnalysis);

router.get("/:opportunityId/analysis", getAnalysis);

export default router;
