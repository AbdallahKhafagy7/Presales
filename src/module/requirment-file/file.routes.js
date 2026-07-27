import express from "express";
const router = express.Router();

router.post("/:opportunityId", uploadFileMiddleware, uploadFile);

router.get("/:opportunityId", getFiles);

router.delete("/:fileId", deleteFile);

export default router;
