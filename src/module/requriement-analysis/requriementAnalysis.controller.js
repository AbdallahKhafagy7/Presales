import opportunityRequirements from "../../model/opportunity-requirements/opportunity-requirements.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import RequirementFile from "../../model/requirment-file/requirment-file.js"
import { NotFoundError } from "../../utils/error/errorClass.js";
import { extract_data } from "../../utils/files/read-files-data.js";
import logger from "../../utils/logger.js";
import { generateReqAnalysisPrompt } from "../../utils/systemPrompts.js";
import generateResponse from "../../utils/ai.js";
import TechnologyStackRecommendation from "../../model/tech-stack-recommendation/tech-stack-recommendation.js"
// export const getRequirementAnalysis = (req, res) => {
//     const { id } = req.params;

//     const opportunityFiles = RequirementFile.find({ opportunityId: id });


// }

//not completed
export const analysisContext = async (req, res) => {
    const { id } = req.params;

    const opportunityFiles = await RequirementFile.find({
        opportunityId: id,
    });
    const opportunityRequirement = await opportunityRequirements.find({ opportunityId: id })

    res.status(200).json({
        requirementFiles: opportunityFiles.length,
        requirementsText: opportunityRequirement
            ? "Avilable"
            : "Not Available",
    })

}

export const getOpportunity = async (req, res) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
        throw new NotFoundError("Opportunity not found");
    }

    return res.status(200).json({
        projectName: opportunity.projectName,
        client: opportunity.clientName,
        industry: opportunity.industry,
    })
}

export const generateAnalysis = async (req, res) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
        throw new NotFoundError("Opportunity not found");
    }
    const opportunityFiles = await RequirementFile.find({
        opportunityId: id,
    });
    const opportunityRequirement = await opportunityRequirements.find({ opportunityId: id })

    const filesContent = await extract_data(opportunityFiles);


    const recommendations = await TechnologyStackRecommendation.find({
        opportunityId: id,
    });

    const recommendedTechnologies = recommendations
        // Extract the techStack array from each recommendation and flatten them into one array
        .flatMap(recommendation => recommendation.techStack)
        
        // Convert each technology object into a readable text format
        .map(tech => `
    Technology: ${tech.technologyName}
    Category: ${tech.category}
    Reason: ${tech.reason}
    `).join("\n");  // Combine all technology strings into one string for the AI prompt


    const prompt = generateReqAnalysisPrompt(
        opportunity,
        recommendedTechnologies,
        filesContent,
        opportunityRequirement.requirementsText
    );

    const reqAnalysisResult = await generateResponse(prompt);
    let reqAnalysisResultCleaned;
    try {
        const cleanJson = reqAnalysisResult   // cleaning data received
            .replace(/```json/g, "") //problem deep seek return =>``` json:{} ```
            .replace(/```/g, "")
            .trim();

        reqAnalysisResultCleaned = JSON.parse(cleanJson);
    } catch {
        return res.status(500).json({
            message: "AI returned invalid JSON",
            aiResponse,
        });
    }
    return res.status(200).json({
        executiveSummary: reqAnalysisResultCleaned.reqAnalysisResultCleaned,
        functionalRequirements: reqAnalysisResultCleaned.functionalRequirements,
        nonFunctionalRequirements: reqAnalysisResultCleaned.nonFunctionalRequirements,
        mainModules: reqAnalysisResultCleaned.mainModules,
        externalIntegrations: reqAnalysisResultCleaned.externalIntegrations,
        assumptions: reqAnalysisResultCleaned.assumptions,
        clarificationQuestions: reqAnalysisResultCleaned.clarificationQuestions,
        possibleRisks: reqAnalysisResultCleaned.possibleRisks,
        status: "draft",
    })
}

