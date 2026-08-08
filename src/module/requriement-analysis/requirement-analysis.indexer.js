import { normalizeSectionContent } from "../../utils/section-text-normalization/index.js";
import { ANALYSIS_SECTIONS } from "./requirement-analysis.section.js";
import replaceVectors from "../../utils/replaceVectors.js"
import RequirementAnalysis from "../../model/requirement-analysis/requirementAnalysis.model.js"
import Opportunity from "../../model/opportunity/opportunity.model.js";
export const indexRequirementAnalyses = async (req, res) => {
    const analyses = await RequirementAnalysis.find({
        status: "published",
    });

    const opportunities = await Opportunity.find();
    
    const opportunityMap = new Map(
        opportunities.map((opportunity) => [
            String(opportunity._id),
            opportunity,
        ])
    );

    let indexedCount = 0;
    let analysesProcessed = 0;
    
    for (const analysis of analyses) {
           
        const opportunity = opportunityMap.get(
            String(analysis.opportunityId)
        );
        if (!opportunity) {
            continue;
        }

        const documents = [];


        for (const section of ANALYSIS_SECTIONS) {
            const content = normalizeSectionContent(
                analysis[section.field]
            );
        

        if (!content) {
            continue;
        }

        const text = [
            `Project: ${opportunity.projectName || "Unknown"}`,
            `Client: ${opportunity.clientName || "Unknown"}`,
            `Industry: ${opportunity.industry || "Unknown"}`,
            `Section: ${section.name}`,
            "",
            content,
        ].join("\n");
        console.log(text);
        
        documents.push({
            title: `${opportunity.projectName} - ${section.name}`,
            text,
            metadata: {
                 opportunityId: String(analysis.opportunityId),
                section: section.name,
                projectName: opportunity.projectName,
            },
        });
    }

    await replaceVectors(
        "requirement_analysis",
        analysis._id,
        documents
    );

    analysesProcessed++;
    indexedCount += documents.length;
}

res.status(200).json({
    message: "Requriement analysis indexed successfully",
    indexedCount
})
};