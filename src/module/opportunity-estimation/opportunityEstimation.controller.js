import Opportunity from "../../model/opportunity/opportunity.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { NotFoundError } from "../../utils/error/errorClass.js";
import RequirementFile from "../../model/requirment-file/requirment-file.js";
import opportunityRequirements from "../../model/opportunity-requirements/opportunity-requirements.js";
import TechnologyStackRecommendation from "../../model/tech-stack-recommendation/tech-stack-recommendation.js";
import reqAnalysis from "../../model/requirement-analysis/requirementAnalysis.model.js";
import generateResponse, { extractJsonPayload } from "../../utils/ai.js";
import { buildEstimationPrompt } from "../../utils/systemPrompts.js";
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

export const getContext = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }
    const opportunityRequirement = await opportunityRequirements.findOne({
      opportunityId: opportunity._id,
    });
    const requirementAnalysis = await reqAnalysis.findOne({
      opportunityId: opportunity._id,
    });
    const techRecommendation = await TechnologyStackRecommendation.findOne({
      opportunityId: opportunity._id,
    });
    const response = new ApiResponse(200, {
      requirementsText: opportunityRequirement?.requirementsText?.trim()
        ? "Available"
        : "Missing",
      RequirementAnalysis: requirementAnalysis ? "Available" : "Missing",
      technologyRecommendation: techRecommendation?.trim()
        ? "Available"
        : "Missing",
      answeredClarificationQuestions:
        requirementAnalysis.clarificationQuestions.length ?? 0,
      Assumptions: requirementAnalysis.assumptions.length ?? 0,
    });

    return res.status(response.statusCode).json(response);
  } catch (error) {
    next(error);
  }
};

export const generateEstimation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    const requirementsAnalysis = await reqAnalysis.findOne({
      opportunityId: id,
    });

    const technologyStack = await TechnologyStackRecommendation.findOne({
      opportunityId: id,
    });

    const prompt = buildEstimationPrompt({
      opportunity,
      requirementsAnalysis,
      technologyStack,
      clarificationQuestions: requirementsAnalysis?.clarificationQuestions,
      assumptions: requirementsAnalysis?.assumptions,
    });

    const aiResponse = await generateResponse(prompt);

    const response = extractJsonPayload(aiResponse);
    return res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};
