import RequirementFile from "../models/RequirementFile.js";
import Opportunity from "../models/Opportunity.js";
import uploader from "../utils/uploader.js";
import path from "path";
import AppError from "../utils/appError.js";

const uploadFile = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const file = req.file;
    if (!file) {
      throw new AppError("File not uploaded!", 400);
    }

    const fileType = path.extname(file.originalname).slice(1);
    const allowedTypes = ["pdf", "docx", "txt"];
    if (!allowedTypes.includes(fileType)) {
      throw new AppError("File type is not allowed!", 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new AppError("File size must not exceed 5 MB!", 400);
    }

    const fileSize = file.size;
    const fileOriginal = file.originalname;
    const fileName = file.filename;
    const filePath = file.path;

    const f = await RequirementFile.create({
      opportunityId,
      fileType,
      fileSize,
      fileOriginal,
      fileName,
      filePath,
    });

    res.status(201).json({ data: f });
  } catch (e) {
    next(e);
  }
};

const getFile = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const files = await RequirementFile.find({ opportunityId });

    res.json({ data: files, meta: { len: files.length } });
  } catch (e) {
    next(e);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await RequirementFile.findByIdAndDelete(fileId);
    if (!file) {
      throw new AppError("File not found!", 404);
    }

    res.json({ message: "File deleted successfully!" });
  } catch (e) {
    next(e);
  }
};

export { uploadFile, getFile, deleteFile };
