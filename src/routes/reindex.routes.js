import express from "express";
import { indexRequirementAnalyses } from "../module/requriement-analysis/requirement-analysis.indexer.js";

const router = express.Router();

router.post("/technology-catalog", async (req, res) => {});
router.post("/requirement-analysis", indexRequirementAnalyses);
router.post("/opportunities", async (req, res) => {});

export default router;
