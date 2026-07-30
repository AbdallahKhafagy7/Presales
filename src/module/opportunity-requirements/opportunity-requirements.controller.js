import OpportunityRequirement from "../../model/requirment-file/requirment-file.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";
import ApiResponse from "../../utils/ApiResponse.js";

const createRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });

    const { requirementsText } = req.body;
    if (!requirementsText) {
      throw new BadRequestError("Requirement text is required!");
    }

    // create
    if (!requirement) {
      const or = await OpportunityRequirement.create({
        opportunityId,
        requirementsText,
      });
      res.json({ data: or });
    }

    // update
    requirement.requirementsText = requirementsText;
    await requirement.save();

    const response = new ApiResponse(
      201,
      requirement,
      "Data Successfully created",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

const getRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    console.log(opportunityId);

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });
    if (!requirement) {
      throw new BadRequestError(
        `No requirement text exits for id ${opportunityId}`,
      );
    }

    const response = new ApiResponse(200, requirement, "");
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

const deleteRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new BadRequestError("Opportunity not found!");
    }

    const requirement = await OpportunityRequirement.findOne({
      opportunityId,
    });
    if (!requirement) {
      throw new BadRequestError(
        `No requirement text exits for id ${opportunityId}`,
      );
    }

    await requirement.deleteOne();

    const response = new ApiResponse(
      200,
      requirement,
      "Data deleted successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};

export { createRequirement, getRequirement, deleteRequirement };
