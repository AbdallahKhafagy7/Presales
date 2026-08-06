import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

export const getClarificationValidation = z.object({
  opportunityId: objectIdSchema,
});

export const createQuestionValidation = z.object({
  opportunityId: objectIdSchema,

  question: z.string().trim().min(1, "Question cannot be empty"),
});

export const updateQuestionValidation = z
  .object({
    opportunityId: objectIdSchema,
    questionId: objectIdSchema,

    question: z.string().trim().min(1, "Question cannot be empty").optional(),

    answer: z.string().trim().optional(),

    status: z.enum(["answered", "unanswered"]).optional(),
  })
  .refine(
    (data) =>
      data.question !== undefined ||
      data.answer !== undefined ||
      data.status !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const deleteQuestionValidation = z.object({
  opportunityId: objectIdSchema,
  questionId: objectIdSchema,
});

export const createAssumptionValidation = z.object({
  opportunityId: objectIdSchema,

  assumption: z.string().trim().min(1, "Assumption cannot be empty"),
});

export const updateAssumptionValidation = z.object({
  opportunityId: objectIdSchema,
  assumptionId: objectIdSchema,

  assumption: z.string().trim().min(1, "Assumption cannot be empty"),
});

export const deleteAssumptionValidation = z.object({
  opportunityId: objectIdSchema,
  assumptionId: objectIdSchema,
});
