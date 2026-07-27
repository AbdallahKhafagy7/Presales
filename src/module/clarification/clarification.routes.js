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

import validation from "../../middleware/validation.middleware.js";

router.get(
  "/:opportunityId",
  validation(getClarificationValidation),
  getClarification,
);

router.post(
  "/:opportunityId/questions",
  validation(createQuestionValidation),
  addQuestion,
);

router.patch(
  "/:opportunityId/questions/:questionId",
  validation(updateQuestionValidation),
  updateQuestion,
);

router.delete(
  "/:opportunityId/questions/:questionId",
  validation(deleteQuestionValidation),
  deleteQuestion,
);

router.post(
  "/:opportunityId/assumptions",
  validation(createAssumptionValidation),
  addAssumption,
);

router.patch(
  "/:opportunityId/assumptions/:assumptionId",
  validation(updateAssumptionValidation),
  updateAssumption,
);

router.delete(
  "/:opportunityId/assumptions/:assumptionId",
  validation(deleteAssumptionValidation),
  deleteAssumption,
);

export default router;
