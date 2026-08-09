import TechnologyCatalog from "../../model/technology-catalog/technology-catalog.model.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import reqAnalysis from "../../model/requirement-analysis/requirementAnalysis.model.js";
import replaceVectors from "../../utils/replaceVectors.js";
import ApiResponse from "../../utils/ApiResponse.js";

export default async (req, res, next) => {
  try {
    const technologies = await TechnologyCatalog.find({});

    let totalIndexed = 0;

    for (const tech of technologies) {
      const textContent = [
        `Technology: ${tech.technologyName}`,
        `Category: ${tech.category}`,
        `Preferred Use Case: ${tech.preferredUsecase}`,
        tech.notes ? `Notes: ${tech.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const document = {
        title: tech.technologyName,
        text: textContent,
        metadata: {
          category: tech.category,
        },
      };

      await replaceVectors("technology_catalog", tech._id, [document]);
      totalIndexed++;
    }

    const r = { indexedCount: totalIndexed };

    const response = new ApiResponse(
      200,
      r,
      "Technology catalog indexed successfully",
    );
    return res.status(response.statusCode).json(response);
  } catch (e) {
    next(e);
  }
};
