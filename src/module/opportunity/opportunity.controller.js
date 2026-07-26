import Opportunity from "../../model/opportunity/opportunity.model.js";

export const createOpportunity = async (req, res, next) => {
    const opportunityData = req.body;
    const opportunity = await Opportunity.create({
        ...opportunityData,
        status: "new",
    });
    return res.status(201).json({
        message: "Opportunity created successfully.",
        data: opportunity,
    });
};

export const getAllOpportunities = async (
    req,
    res,
    next) => {
    const { status, search } = req.body;

    // const filter = {};
    // if (search) {
    //     filter.$or = [
    //         { projectName: { $regex: search } },
    //         { clientName: { $regex: search } },
    //         { industry: { $regex: search } }
    //     ];
    // }
    const opportunities = await Opportunity.find();
    const data = opportunities.map((opportunity) => ({
        projectName: opportunity.projectName,
        status: opportunity.status,
        industry: opportunity.industry,
        contact: opportunity.contactEmail,
        created: opportunity.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
    }));
    return res.status(200).json({
        message: "Success",
        data
    });
};