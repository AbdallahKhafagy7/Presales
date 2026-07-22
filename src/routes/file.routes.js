const express = require("express");
const router = express.Router();
const uploadFileMiddleware = require("../middleware/fileUpload");
const {
  uploadFile,
  getFiles,
  deleteFile,
} = require("../controllers/fileController");

router.post("/:opportunityId", uploadFileMiddleware, uploadFile);

router.get("/:opportunityId", getFiles);

router.delete("/:fileId", deleteFile);

export default router;
