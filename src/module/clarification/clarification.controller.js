import {
  addQuestionService,
  getClarificationService,
  updateQuestionService,
  deleteQuestionService,
  addAssumptionService,
  updateAssumptionService,
  deleteAssumptionService,
} from "./clarification.service.js";

export const getClarification = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const clarification = await getClarificationService(opportunityId);

    if (!clarification) {
      return res.status(404).json({
        message: "Clarification not found",
      });
    }

    return res
      .status(200)
      .json({ message: "Clarification found successfully", clarification });
  } catch (error) {
    next(error);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const { question } = req.body;

    const clarification = await addQuestionService(opportunityId, question);

    if (!clarification) {
      return res.status(404).json({
        message: "Clarification not found",
      });
    }

    return res.status(201).json({
      message: "Question created successfully",
      clarification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { opportunityId, questionId } = req.params;
    const updatedQuestion = await updateQuestionService(
      opportunityId,
      questionId,
      req.body,
    );

    if (!updatedQuestion) {
      return res.status(404).json("Clarification or question not found");
    }

    return res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const { opportunityId, questionId } = req.params;

    const deletedQuestion = await deleteQuestionService(
      opportunityId,
      questionId,
    );

    if (!deletedQuestion) {
      return res.status(404).json("Clarification or question not found");
    }

    return res.status(200).json({
      message: "Question deleted successfully",
      deletedQuestion,
    });
  } catch (error) {
    next(error);
  }
};

export const addAssumption = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;
    const { assumption } = req.body;

    const clarification = await addAssumptionService(opportunityId, assumption);

    if (!clarification) {
      return res.status(404).json("Clarification not found");
    }

    return res.status(201).json({
      message: "Assumption created successfully",
      clarification,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAssumption = async (req, res, next) => {
  try {
    const { opportunityId, assumptionId } = req.params;
    const { assumption } = req.body;

    const updatedAssumption = await updateAssumptionService(
      opportunityId,
      assumptionId,
      assumption,
    );

    if (!updatedAssumption) {
      return res.status(404).json("Clarification or assumption not found");
    }

    return res.status(200).json({
      message: "Assumption successfully updated",
      updatedAssumption,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssumption = async (req, res, next) => {
  try {
    const { opportunityId, assumptionId } = req.params;

    const deletedAssumption = await deleteAssumptionService(
      opportunityId,
      assumptionId,
    );

    if (!deletedAssumption) {
      return res.status(404).json("Clarification or assumption not found");
    }

    return res.status(200).json({
      message: "Assumption successfully deleted",
      deletedAssumption,
    });
  } catch (error) {
    next(error);
  }
};
