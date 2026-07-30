import express from "express";
import uploader from "../utils/uploader.js";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../module/requirment-file/requirment-file.controller.js";
const router = express.Router();

router.post("/:opportunityId", uploadFileMiddleware, uploadFile);

const router = express.Router();
router.post("/:opportunityId", uploader.single("file-upload"), uploadFile);
router.get("/:opportunityId", getFiles);
router.delete("/:fileId", deleteFile);

export default router;
