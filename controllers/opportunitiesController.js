import Opportunity from "../models/Opportunity.js";
import OpportunityRequirement from "../models/OpportunityRequirement.js";
import RequirementFile from "../models/RequirementFile.js";
import AppError from "../utils/appError.js";

const createOpportunity = async (req, res, next) => {
  try {
    const { title, clientName, description, status } = req.body;

    if (!title) {
      throw new AppError("Title is required!", 400);
    }

    if (!clientName) {
      throw new AppError("Client name is required!", 400);
    }

    let opportunity = { title, clientName };

    if (status) {
      if (status === "ready-for-analysis") {
        throw new AppError(
          "Opportunity cannot be marked as ready for analysis before adding requirements text or uploading files",
          400,
        );
      }
      opportunity = { status, ...opportunity };
    }

    if (description) {
      opportunity = { description, ...opportunity };
    }

    const o = await Opportunity.create(opportunity);
    res.status(201).json(o);
  } catch (e) {
    next(e);
  }
};

const updateOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    const { title, clientName, description, status } = req.body;

    if (title) {
      opportunity.title = title;
    }
    if (clientName) {
      opportunity.clientName = clientName;
    }
    if (description) {
      opportunity.description = description;
    }
    if (status) {
      if (status === "ready-for-analysis") {
        const requirement = await OpportunityRequirement.findOne({
          opportunityId,
        });
        const files = await RequirementFile.find({ opportunityId });
        if (!requirement || files.meta.len <= 0) {
          throw new AppError(
            "Opportunity cannot be marked as ready for analysis before adding requirements text or uploading files",
            400,
          );
        }
      }
      opportunity.status = status;
    }

    await opportunity.save();
    res.json(opportunity);
  } catch (e) {
    next(e);
  }
};

const getAllOpportunities = async (req, res, next) => {
  try {
    const q = {};
    if (req.query["status"]) {
      q["status"] = req.query["status"];
    }
    if (req.query["title"]) {
      q["title"] = req.query["title"];
    }
    if (req.query["client name"]) {
      q["client name"] = req.query["client name"];
    }

    const opportunities = await Opportunity.find(q);
    res.json({
      data: opportunities,
      meta: {
        len: opportunities.length,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }
    res.json({ data: opportunity });
  } catch (e) {
    next(e);
  }
};

const deleteOpportunity = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      throw new AppError("Opportunity not found!", 404);
    }

    await OpportunityRequirement.deleteOne({ opportunityId });
    await RequirementFile.deleteMany({ opportunityId });

    await opportunity.deleteOne();
    res.json({ message: "Opportunity deleted successfully!" });
  } catch (e) {
    next(e);
  }
};

export {
  createOpportunity,
  updateOpportunity,
  getAllOpportunities,
  getOpportunity,
  deleteOpportunity,
};
