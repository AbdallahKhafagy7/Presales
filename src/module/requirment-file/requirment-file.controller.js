import path from "path";
import RequirementFile from "../../model/requirment-file/requirment-file.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import uploader from "../../utils/uploader.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";

const uploadFile = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found!");
    }

    const file = req.file;
    if (!file) {
      throw new NotFoundError("File not uploaded!");
    }

    const fileType = path.extname(file.originalname).slice(1);
    const allowedTypes = ["pdf", "docx", "txt"];
    if (!allowedTypes.includes(fileType)) {
      throw new NotFoundError("File type is not allowed!");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestError("File size must not exceed 5 MB!");
    }
    const fileSize = file.size;
    const originalName = file.originalname;
    const fileName = file.filename;
    const filePath = file.path;

    const f = await RequirementFile.create({
      opportunityId,
      fileType,
      fileSize,
      originalName,
      fileName,
      filePath,
    });

    const response = new ApiResponse(201, f, "File uploadded successfully");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

const getFiles = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found!");
    }

    const files = await RequirementFile.find({ opportunityId });

    const response = new ApiResponse(200, files, "");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await RequirementFile.findByIdAndDelete(fileId);
    if (!file) {
      throw new NotFoundError("File not found!");
    }

    const response = new ApiResponse(200, file, "File deleted successfully");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

export { uploadFile, getFiles, deleteFile };
