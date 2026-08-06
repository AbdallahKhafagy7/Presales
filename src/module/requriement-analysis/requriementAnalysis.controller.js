import opportunityRequirements from "../../model/opportunity-requirements/opportunity-requirements.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import RequirementFile from "../../model/requirment-file/requirment-file.js";
import { BadRequestError, NotFoundError } from "../../utils/error/errorClass.js";
import { extract_data } from "../../utils/files/read-files-data.js";
import { generateReqAnalysisPrompt } from "../../utils/systemPrompts.js";
import generateResponse, { extractJsonPayload } from "../../utils/ai.js";
import TechnologyStackRecommendation from "../../model/tech-stack-recommendation/tech-stack-recommendation.js";
import reqAnalysis from "../../model/requirement-analysis/requirementAnalysis.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function normalizeAnalysisPayload(raw = {}) {
  return {
    executiveSummary: toStringArray(raw.executiveSummary),
    functionalRequirements: toStringArray(raw.functionalRequirements),
    nonFunctionalRequirements: toStringArray(raw.nonFunctionalRequirements),
    mainModules: toStringArray(raw.mainModules),
    externalIntegrations: toStringArray(raw.externalIntegrations),
    assumptions: toStringArray(raw.assumptions),
    clarificationQuestions: toStringArray(
      raw.clarificationQuestions ?? raw.suggestedClarificationQuestions,
    ),
    possibleRisks: toStringArray(raw.possibleRisks ?? raw.risks),
  };
}

export const analysisContext = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunityFiles = await RequirementFile.find({
      opportunityId: id,
    });
    const opportunityRequirement = await opportunityRequirements.findOne({
      opportunityId: id,
    });

    const response = new ApiResponse(200, {
      requirementsText: opportunityRequirement?.requirementsText?.trim()
        ? "Available"
        : "Not Available",
      requirementFiles: opportunityFiles.length,
      requirementsSource:
        opportunityRequirement?.requirementsText?.trim() || opportunityFiles.length > 0
          ? "Ready"
          : "Not Ready",
      analyzerStatus:
        opportunityRequirement?.requirementsText?.trim() || opportunityFiles.length > 0
          ? "Ready to run"
          : "Needs requirements",
    });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const getOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }
    const response = new ApiResponse(200, {
      projectName: opportunity.projectName,
      client: opportunity.clientName,
      industry: opportunity.industry,
    });
    return res.status(response.statusCode).json(response.data);
  } catch (error) {
    next(error);
  }
};

export const generateAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    const opportunityFiles = await RequirementFile.find({
      opportunityId: id,
    });
    const opportunityRequirement = await opportunityRequirements.findOne({
      opportunityId: id,
    });

    const requirementsText = opportunityRequirement?.requirementsText?.trim() || "";
    if (!requirementsText && opportunityFiles.length === 0) {
      throw new BadRequestError(
        "Add requirements text or upload requirement files before generating analysis.",
      );
    }

    const filesContent =
      opportunityFiles.length > 0 ? await extract_data(opportunityFiles) : "";

    const recommendations = await TechnologyStackRecommendation.find({
      opportunityId: id,
      status: "published",
    });

    const recommendedTechnologies = recommendations
      .flatMap((recommendation) => recommendation.techStack)
      .map(
        (tech) => `
    Technology: ${tech.technologyName}
    Category: ${tech.category}
    Reason: ${tech.reason}
    `,
      )
      .join("\n");

    const prompt = generateReqAnalysisPrompt(
      opportunity,
      recommendedTechnologies,
      filesContent,
      requirementsText,
    );

    const reqAnalysisResult = await generateResponse(prompt);

    let reqAnalysisResultCleaned;
    try {
      reqAnalysisResultCleaned = extractJsonPayload(reqAnalysisResult);
    } catch {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        aiResponse: reqAnalysisResult,
      });
    }

    const normalized = normalizeAnalysisPayload(reqAnalysisResultCleaned);

    const reqAnalysisData = await reqAnalysis.findOneAndUpdate(
      {
        opportunityId: id,
        status: "draft",
      },
      {
        $set: {
          ...normalized,
          status: "draft",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    const response = new ApiResponse(
      201,
      reqAnalysisData,
      "Requirement analysis draft generated successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const saveAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    const targetDraft = await reqAnalysis.findOne({
      opportunityId: id,
      status: "draft",
    });
    if (!targetDraft) {
      throw new NotFoundError("Draft requirement analysis not found");
    }

    await reqAnalysis.findOneAndDelete({
      opportunityId: id,
      status: "published",
    });

    targetDraft.status = "published";
    await targetDraft.save();

    const response = new ApiResponse(200, targetDraft);
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    const publishedAnalysis = await reqAnalysis.findOne({
      opportunityId: id,
      status: "published",
    });
    if (!publishedAnalysis) {
      throw new NotFoundError("No published requirement analysis found to update");
    }

    const normalized = normalizeAnalysisPayload(req.body);
    Object.assign(publishedAnalysis, normalized);
    await publishedAnalysis.save();

    const response = new ApiResponse(
      200,
      publishedAnalysis,
      "Requirement analysis updated successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    const publishedAnalysis = await reqAnalysis.findOne({
      opportunityId: id,
      status: "published",
    });

    const response = new ApiResponse(
      200,
      publishedAnalysis || null,
      publishedAnalysis
        ? "Requirement analysis found successfully"
        : "No published requirement analysis found",
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};
