import OpportunityRequirement from "../../model/requirment-file/requirment-file.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import {
  BadRequestError,
  NotFoundError,
} from "../../utils/error/errorClass.js";

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
      throw new BadRequestError("Opportunity not found!");
    }

    const requirement = await OpportunityRequirement.findOne({ opportunityId });
    if (!requirement) {
      throw new BadRequestError(
        `No requirement text exits for id ${opportunityId}`,
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

    res.json({ message: "Data deleted successfully!" });
  } catch (e) {
    next(e);
  }
};

export { createRequirement, getRequirement, deleteRequirement };
