import OpportunityRequirement from "../../model/opportunity-requirements/opportunity-requirements.js";
import TechnologyCatalog from "../../model/technology-catalog/technology-catalog.model.js";
import TechnologyStackRecommendation from "../../model/tech-stack-recommendation/tech-stack-recommendation.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";
import generateResponse from "../../utils/ai.js";
import { technologyStackRecommendationPrompt } from "../../utils/systemPrompts.js";

const generateRecommendation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });
    if (!requirement) {
      throw new BadRequestError("Opportunity requirement not found!");
    }

    const projectRequirement = requirement["requirementsText"];

    const technologyStack = await TechnologyCatalog.find();

    const prompt = technologyStackRecommendationPrompt(
      projectRequirement,
      technologyStack,
    );

    const AI_response = await generateResponse(prompt);

    const recommendation = JSON.parse(
      AI_response.replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim(),
    );
    recommendation["opportunityId"] = opportunityId;
    recommendation["status"] = "draft";

    const r = await TechnologyStackRecommendation.create(recommendation);

    const response = new ApiResponse(
      201,
      r,
      "Recommendation generated successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};
const getRecommendation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const recommendations = await TechnologyStackRecommendation.find({
      opportunityId,
    });

    const r = recommendations.filter(
      (recommendation) => recommendation["status"] === "published",
    )[0];
    if (!r) {
      throw new BadRequestError("No recommendation found");
    }

    const response = new ApiResponse(201, r, "");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};
const saveRecommendation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    // 1. Ensure Opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    // 2. Fetch target draft to publish
    let targetDraft = await TechnologyStackRecommendation.findOne({
      opportunityId,
      status: "draft",
    }).sort({ createdAt: -1 });

    if (!targetDraft) {
      throw new BadRequestError(
        "No valid draft recommendation found to publish!",
      );
    }

    // 3. Find existing published recommendation (if any)
    const existingPublished = await TechnologyStackRecommendation.findOne({
      opportunityId,
      status: "published",
    });

    // 4. Compare timestamps if a published version already exists
    if (existingPublished) {
      const targetTime = new Date(targetDraft.createdAt).getTime();
      const publishedTime = new Date(existingPublished.createdAt).getTime();

      if (targetTime <= publishedTime) {
        throw new BadRequestError(
          "The target draft is older than or equal to the currently published recommendation.",
        );
      }

      // Demote existing published recommendation to draft
      existingPublished.status = "draft";
      await existingPublished.save();
    }

    // 5. Publish target draft
    targetDraft.status = "published";
    await targetDraft.save();

    const response = new ApiResponse(
      200,
      targetDraft,
      "Recommendation published successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};
const deleteRecommendation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const recommendations = await TechnologyStackRecommendation.find({
      opportunityId,
    });

    const r = recommendations.filter(
      (recommendation) => recommendation["status"] === "published",
    )[0];
    if (!r) {
      throw new BadRequestError("No recommendation found");
    }

    await r.deleteOne();

    const response = new ApiResponse(201, r, "Recommendation deleted");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

export {
  generateRecommendation,
  getRecommendation,
  saveRecommendation,
  deleteRecommendation,
};
