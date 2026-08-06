import express from "express";
import uploader from "../../utils/uploader.js";
import {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
} from "./requirment-file.controller.js";
const router = express.Router();

router.post("/:opportunityId", uploader.single("file-upload"), uploadFile);
router.get("/download/:fileId", downloadFile);
router.get("/:opportunityId", getFiles);
router.delete("/:fileId", deleteFile);

export default router;
