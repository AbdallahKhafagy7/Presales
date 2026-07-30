import Opportunity from "../../model/opportunity/opportunity.model.js";
import Clarification from "../../model/clarification/clarification.model.js";
import OpportunityRequirement from "../../model/opportunity-requirements/opportunity-requirements.js";
import RequirementFile from "../../model/requirment-file/requirment-file.js";

import { dateConverter } from "../../utils/date/date-converter.js";
import { NotFoundError } from "../../utils/error/errorClass.js";

export const createOpportunity = async (req, res, next) => {
  const opportunityData = req.body;

  const opportunity = await Opportunity.create({
    ...opportunityData,
    status: "new",
  });

  await Clarification.create({
    opportunityId: opportunity._id,
  });

  return res.status(201).json({
    message: "Opportunity created successfully.",
    data: opportunity,
  });
};

export const getAllOpportunities = async (req, res, next) => {
  const opportunities = await Opportunity.find();

  const data = opportunities.map((opportunity) => ({
    projectName: opportunity.projectName,
    status: opportunity.status,
    industry: opportunity.industry,
    contact: opportunity.contactEmail,
    created: dateConverter(opportunity.createdAt),
  }));

  return res.status(200).json({
    message: "Success",
    data,
  });
};

export const getOpportunityById = async (req, res) => {
  const { id } = req.params;

  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    throw new NotFoundError("Opportunity not found");
  }

  const data = {
    clientName: opportunity.clientName,
    projectName: opportunity.projectName,
    industry: opportunity.industry,
    contactPerson: opportunity.contactPerson,
    contactEmail: opportunity.contactEmail,
    createdDate: dateConverter(opportunity.createdAt),
    lastUpdate: dateConverter(opportunity.updatedAt),
    generalNotes: opportunity.generalNotes,
  };

  return res.status(200).json({
    message: "Success",
    data,
  });
};

export const updateOpportunity = async (req, res, next) => {
  const { id } = req.params;
  const updatedData = req.body;

  const opportunity = await Opportunity.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!opportunity) {
    throw new NotFoundError("Opportunity not found");
  }

  return res.status(200).json({
    message: "Opportunity updated successfully",
    data: opportunity,
  });
};

export const deleteOpportunity = async (req, res, next) => {
  const { id } = req.params;

  const opportunity = await Opportunity.findById(id);

  if (!opportunity) {
    throw new NotFoundError("Opportunity not found");
  }

  await OpportunityRequirement.deleteOne({
    opportunityId: id,
  });

  await RequirementFile.deleteMany({
    opportunityId: id,
  });

  await Clarification.deleteOne({
    opportunityId: id,
  });

  await opportunity.deleteOne();

  return res.status(200).json({
    message: "Opportunity deleted successfully",
  });
};
