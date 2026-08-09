import express from "express";
import reindexRoutes from "./reindex.routes.js";
import { chatHandler } from "../module/chat/chat.controller.js";
import { chatResetHandler } from "../module/chat/chat-reset.controller.js";

const router = express.Router();
router.post("/chat", chatHandler);
router.post("/chat/reset", chatResetHandler);
router.use("/reindex", reindexRoutes);

export default router;
