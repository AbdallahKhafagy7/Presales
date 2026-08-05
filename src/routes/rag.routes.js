import express from "express";
import reindexRoutes from "./reindex.routes.js";
import { chatHandler } from "../module/chat/chat.controller.js";

const router = express.Router();
router.post("/chat", chatHandler);
router.use("/reindex", reindexRoutes);

export default router;
