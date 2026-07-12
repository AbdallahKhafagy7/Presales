import express from "express";
import {
  uploadFile,
  getFile,
  deleteFile,
} from "../controllers/filesController.js";
import uploader from "../utils/uploader.js";

const requirementFileRouter = express.Router({ mergeParams: true });

requirementFileRouter.post(
  "/:opportunityId",
  uploader.single("file-upload"),
  uploadFile,
);
requirementFileRouter.get("/:opportunityId", getFile);
requirementFileRouter.delete("/:fileId", deleteFile);

export default requirementFileRouter;
