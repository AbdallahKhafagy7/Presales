import express from "express";
import reindexRoutes from "./reindex.routes.js";

import opportunityEmbeddingModel from "../model/opportunity-embedding/opportunity-embedding.model.js";

const router = express.Router();
router.post("/chat", async (req, res, next) => {});
router.use("/reindex", reindexRoutes);

export default router;
