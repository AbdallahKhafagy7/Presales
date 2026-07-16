import Opportunity from "../models/Opportunity.js";
import OpportunityRequirement from "../models/OpportunityRequirement.js";
import RequirementFile from "../models/RequirementFile.js";
import OpportunityAnalysis from "../models/OpportunityAnalysis.js";
import {
  extractFromDocx,
  extractFromPdf,
  extractFromTxt,
} from "../utils/parser.js";
import analyzer from "../utils/analyzer.js";
import AppError from "../utils/appError.js";

const createAnalysis = async (req, res, next) => {
  try {
    // validate opportunity exist
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    // validate ready-for-analysis
    if (opportunity.status !== "ready-for-analysis") {
      throw new AppError(
        "Opportunity not ready for analysis yet, add requirements text or files to be ready!",
        400,
      );
    }

    // get requirements text / uploaded files if available
    const requirement = await OpportunityRequirement.findOne({ opportunityId });

    const parsedFiles = [];
    const files = await RequirementFile.find({ opportunityId });
    for (const file of files) {
      const parsedFile = {
        originalName: file.originalName,
        data: "",
      };

      if (file.fileType === "txt") {
        parsedFile.data = await extractFromTxt(file.filePath);
      } else if (file.fileType === "pdf") {
        parsedFile.data = await extractFromPdf(file.filePath);
      } else if (file.fileType === "docx") {
        parsedFile.data = await extractFromDocx(file.filePath);
      }

      parsedFiles.push(parsedFile);
    }

    // format inputs
    const inputs = {};
    if (requirement) {
      inputs["requirement"] = requirement.requirementsText;
    }
    if (parsedFiles.length > 0) {
      inputs["files"] = parsedFiles;
    }

    // get analysis
    const analysisParams = await analyzer(inputs);

    // create analysis object
    const analysisObject = await OpportunityAnalysis.create({
      ...analysisParams,
      opportunityId,
      analyzedAt: new Date(),
    });

    res.status(201).json({ data: analysisObject });
  } catch (e) {
    next(e);
  }
};

const getAnalysis = async (req, res, next) => {
  try {
    // validate opportunity exist
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const analysis = await OpportunityAnalysis.findOne({ opportunityId }).sort({
      analyzedAt: -1,
    });

    if (!analysis) {
      throw new AppError("Analysis not found!", 404);
    }

    res.json({ data: analysis });
  } catch (e) {
    next(e);
  }
};

export { createAnalysis, getAnalysis };
