import Opportunity from "../../model/opportunity/opportunity.model.js";
import opportunityRequirements from "../../model/opportunity-requirements/opportunity-requirements.js";
import requirmentFile from "../../model/requirment-file/requirment-file.js";
import replaceVectors from "../../utils/replaceVectors.js";

import { extract_data } from "../../utils/files/read-files-data.js";

export const opportunityIndexer = async (req, res) => {
  const opportunities = await Opportunity.find();

  for (const opportunity of opportunities) {
    const requirement = await opportunityRequirements.findOne({
      opportunityId: opportunity._id,
    });

    let reqText = "No requirement text provided";

    if (requirement?.requirementsText?.trim()) {
      reqText = requirement.requirementsText;
    }

    const files = await requirmentFile.find({ opportunityId: opportunity._id });

    let filesText = "No files provided";

    if (files.length > 0) {
      filesText = await extract_data(files);
    }

    const text = `
      Project name: ${opportunity.projectName}
      Client name: ${opportunity.clientName}
      Industry: ${opportunity.industry}
      Status: ${opportunity.status}
      Created Date: ${opportunity.createdAt}
      General notes: ${opportunity.generalNotes}
      Client Requirements: ${reqText}
      Requirement Files: ${filesText}
    `;

    const document = {
      title: opportunity.projectName,
      text,
      metadata: {
        opportunityId: String(opportunity._id),
        projectName: opportunity.projectName,
        clientName: opportunity.clientName,
        industry: opportunity.industry,
        status: opportunity.status,
      },
    };

    await replaceVectors("opportunity", String(opportunity._id), [document]);
  }

  return res.status(200).json({
    message: "Opportunities indexed successfully",
  });
};
