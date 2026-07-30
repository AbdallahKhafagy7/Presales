import express from "express";
import {
  generateRecommendation,
  getRecommendation,
  saveRecommendation,
  deleteRecommendation,
} from "../module/tech-stack-recommendation/tech-stack-recommendation.controller.js";

const router = express.Router();
router.post("/:opportunityId", generateRecommendation);
router.put("/:opportunityId", saveRecommendation);
router.get("/:opportunityId", getRecommendation);
router.delete("/:opportunityId", deleteRecommendation);

export default router;
