import opportunityRequirements from "../../model/opportunity-requirements/opportunity-requirements.js";
import Opportunity from "../../model/opportunity/opportunity.model.js";
import RequirementFile from "../../model/requirment-file/requirment-file.js"
import { NotFoundError } from "../../utils/error/errorClass.js";
import { extract_data } from "../../utils/files/read-files-data.js";
import logger from "../../utils/logger.js";
import { generateReqAnalysisPrompt } from "../../utils/systemPrompts.js";
import generateResponse from "../../utils/ai.js";
import TechnologyStackRecommendation from "../../model/tech-stack-recommendation/tech-stack-recommendation.js"
import reqAnalysis from "../../model/requirement-analysis/requirementAnalysis.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { dateConverter } from "../../utils/date/date-converter.js";

export const analysisContext = async (req, res) => {
    const { id } = req.params;

    const opportunityFiles = await RequirementFile.find({
        opportunityId: id,
    });
    const opportunityRequirement = await opportunityRequirements.findOne({ opportunityId: id })
    const analysisData = await reqAnalysis.findOne({
        opportunityId: id,
        status: "published",
    })
    let response = "";
    if (!analysisData) {
        response = new ApiResponse(200, [], "No published requirement analysis")
    }
    else {
        response = new ApiResponse(200, {
            requirementsText: opportunityRequirement
                ? "Available"
                : "Not Available",
            requirementFiles: opportunityFiles.length,
            clarificationQuestions: analysisData.clarificationQuestions.length,
            answeredQuestions: 0,
            assumptions: analysisData.assumptions.length,
            requirementsSource: "Ready",
            clarificationAnswered: analysisData.clarificationQuestions.length + "/1 answered",
            analyzerStatus: "Ready to run",
        })
    }
    res.status(response.statusCode).json(response.data);
}

export const getOpportunity = async (req, res) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
        throw new NotFoundError("Opportunity not found");
    }
    const respone = new ApiResponse(200, {
        projectName: opportunity.projectName,
        client: opportunity.clientName,
        industry: opportunity.industry,
    })
    return res.status(respone.statusCode).json(respone.data);
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
    const opportunityRequirement = await opportunityRequirements.findOne({ opportunityId: id })

    const filesContent = opportunityFiles.length > 0
        ? await extract_data(opportunityFiles)
        : "";


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
        opportunityRequirement?.requirementsText
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
    const reqAnalysisData = await reqAnalysis.findOneAndUpdate(
        {
            opportunityId: id,
            status: "draft",
        },
        {
            $set: {
                executiveSummary: reqAnalysisResultCleaned.executiveSummary,
                functionalRequirements: reqAnalysisResultCleaned.functionalRequirements,
                nonFunctionalRequirements: reqAnalysisResultCleaned.nonFunctionalRequirements,
                mainModules: reqAnalysisResultCleaned.mainModules,
                externalIntegrations: reqAnalysisResultCleaned.externalIntegrations,
                assumptions: reqAnalysisResultCleaned.assumptions,
                clarificationQuestions: reqAnalysisResultCleaned.clarificationQuestions,
                possibleRisks: reqAnalysisResultCleaned.possibleRisks,
                updatedAt: Date.now(),
                status: "draft",
            },
        },
        {
            new: true,
            upsert: true,
        }
    );
    const respone = new ApiResponse(201, {
        data: reqAnalysisData,
        createdAt: dateConverter(reqAnalysisData.createdAt),
        updatedAt: dateConverter(reqAnalysisData.updatedAt),
    })
    return res.status(respone.statusCode).json(respone.data);
}

export const saveAnalysis = async (req, res) => {
    const { id } = req.params;
    const opportunity = await Opportunity.findById(id);
    if (!opportunity) {
        throw new NotFoundError("Opportunity not found");
    }
    let targetDraft = await reqAnalysis.findOne({
        opportunityId: id,
        status: "draft",
    })
    if (!targetDraft) {
        throw new NotFoundError("Draft requirement analysis not found");
    }
    await reqAnalysis.findOneAndDelete({
        opportunityId: id,
        status: "published",
    })
    targetDraft.status = "published";
    await targetDraft.save();
    const respone = new ApiResponse(200, targetDraft)
    return res.status(respone.statusCode).json(respone.data);
}

export const getAnalysis = async (req, res) => {
    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
        throw new NotFoundError("Opportunity not found");
    }

    const publishedAnalysis = await reqAnalysis.findOne({
        opportunityId: id,
        status: "published",
    });


    // Delete the draft after confirming that a published analysis exists
    await reqAnalysis.deleteOne({
        opportunityId: id,
        status: "draft",
    });
    const response = new ApiResponse(200, {
        data: publishedAnalysis || [],
    });
    return res.status(response.statusCode).json(response.data);
};