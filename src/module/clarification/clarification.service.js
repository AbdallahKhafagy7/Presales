import Clarification from "../../model/clarification/clarification.model.js";

export const getClarificationService = async (opportunityId) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  return clarification;
};

export const addQuestionService = async (opportunityId, question) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  clarification.questions.push({
    question,
  });

  await clarification.save();

  return clarification;
};

export const updateQuestionService = async (
  opportunityId,
  questionId,
  body,
) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  const question = clarification.questions.id(questionId);

  if (!question) {
    return null;
  }

  Object.assign(question, body);

  await clarification.save();

  return question;
};

export const deleteQuestionService = async (opportunityId, questionId) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  const question = clarification.questions.id(questionId);

  if (!question) {
    return null;
  }

  const deletedQuestion = question.toObject();

  question.deleteOne();

  await clarification.save();

  return question;
};

export const addAssumptionService = async (opportunityId, assumption) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  clarification.assumptions.push({
    assumption,
  });

  await clarification.save();

  return clarification;
};

export const updateAssumptionService = async (
  opportunityId,
  assumptionId,
  assumption,
) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  const assumptionFound = clarification.assumptions.id(assumptionId);

  if (!assumptionFound) {
    return null;
  }

  assumptionFound.assumption = assumption;

  await clarification.save();

  return assumptionFound;
};

export const deleteAssumptionService = async (opportunityId, assumptionId) => {
  const clarification = await Clarification.findOne({ opportunityId });

  if (!clarification) {
    return null;
  }

  const assumptionFound = clarification.assumptions.id(assumptionId);

  if (!assumptionFound) {
    return null;
  }

  const deletedAssumption = assumptionFound.toObject();

  assumptionFound.deleteOne();

  await clarification.save();

  return deletedAssumption;
};
