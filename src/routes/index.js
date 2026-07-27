import express from "express";
import mongoose from "mongoose";

import opportunityRoutes from "./opportunity.routes.js";
import requirementRoutes from "./requirement.routes.js";
import fileRoutes from "./file.routes.js";
// import aiAnalysisRoutes from "./aiAnalysis.routes.js";

const router = express.Router();

router.use("/opportunities", opportunityRoutes);
router.use("/requirements", requirementRoutes);
router.use("/files", fileRoutes);
// router.use("/opportunities", aiAnalysisRoutes);

router.get("/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  const statusCode = databaseConnected ? 200 : 503;

  return res.status(statusCode).json({
    success: databaseConnected,
    statusCode,
    message: databaseConnected
      ? "API is running and database is connected"
      : "API is running but the database is disconnected",
    data: {
      environment: "development",
      database: databaseConnected ? "connected" : "disconnected",
    },
  });
});

export default router;
