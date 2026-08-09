import express from "express";
import { indexRequirementAnalyses } from "../module/requriement-analysis/requirement-analysis.indexer.js";
import { opportunityIndexer } from "../module/opportunity/opportunity.indexer.js";
import technologyCatalogIndexer from "../module/technology-catalog/technology-catalog.indexer.js";

const router = express.Router();

router.post("/technology-catalog", technologyCatalogIndexer);
router.post("/requirement-analysis", indexRequirementAnalyses);
router.post("/opportunities", opportunityIndexer);

export default router;
