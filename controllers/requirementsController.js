import OpportunityRequirement from "../models/OpportunityRequirement.js";
import Opportunity from "../models/Opportunity.js";
import AppError from "../utils/appError.js";

const createRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });

    const { requirementsText } = req.body;
    if (!requirementsText) {
      throw new AppError("Requirement text is required!", 400);
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
    res.status(201).json({ data: requirement });
  } catch (e) {
    next(e);
  }
};

const getRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });
    if (!requirement) {
      throw new AppError(
        `No requirement text exits for id ${opportunityId}`,
        404,
      );
    }

    res.json({ data: { requirement } });
  } catch (e) {
    next(e);
  }
};

const deleteRequirement = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const requirement = await OpportunityRequirement.findOne({
      opportunityId,
    });
    if (!requirement) {
      throw new AppError(
        `No requirement text exits for id ${opportunityId}`,
        404,
      );
    }

    await requirement.deleteOne();

    res.json({ message: "Data deleted successfully!" });
  } catch (e) {
    next(e);
  }
};

export { createRequirement, getRequirement, deleteRequirement };
