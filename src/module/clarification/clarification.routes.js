import express from "express";
const router = Router();

import {
  getClarification,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addAssumption,
  updateAssumption,
  deleteAssumption,
} from "./clarification.controller.js";

import {
  getClarificationValidation,
  createQuestionValidation,
  updateQuestionValidation,
  deleteQuestionValidation,
  createAssumptionValidation,
  updateAssumptionValidation,
  deleteAssumptionValidation,
} from "./clarification.validation.js";

import validate from "../../utils/middleware/zod.validation.js";

router.get(
  "/:opportunityId/clarifications",
  validate(getClarificationValidation),
  getClarification,
);

router.post(
  "/:opportunityId/questions",
  validate(createQuestionValidation),
  addQuestion,
);

router.patch(
  "/:opportunityId/questions/:questionId",
  validate(updateQuestionValidation),
  updateQuestion,
);

router.delete(
  "/:opportunityId/questions/:questionId",
  validate(deleteQuestionValidation),
  deleteQuestion,
);

router.post(
  "/:opportunityId/assumptions",
  validate(createAssumptionValidation),
  addAssumption,
);

router.patch(
  "/:opportunityId/assumptions/:assumptionId",
  validate(updateAssumptionValidation),
  updateAssumption,
);

router.delete(
  "/:opportunityId/assumptions/:assumptionId",
  validate(deleteAssumptionValidation),
  deleteAssumption,
);

export default router;
