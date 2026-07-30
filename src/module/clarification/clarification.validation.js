import { z } from "zod";

// Reusable MongoDB ObjectId validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

// Reusable opportunityId params
const opportunityParamsSchema = z.object({
  opportunityId: objectIdSchema,
});

// Reusable opportunityId + questionId params
const questionParamsSchema = z.object({
  opportunityId: objectIdSchema,
  questionId: objectIdSchema,
});

// Reusable opportunityId + assumptionId params
const assumptionParamsSchema = z.object({
  opportunityId: objectIdSchema,
  assumptionId: objectIdSchema,
});

export const getClarificationValidation = z.object({
  params: opportunityParamsSchema,
});

export const createQuestionValidation = z.object({
  params: opportunityParamsSchema,
  body: z.object({
    question: z.string().trim().min(1, "Question cannot be empty"),
  }),
});

export const updateQuestionValidation = z.object({
  params: questionParamsSchema,
  body: z
    .object({
      question: z.string().trim().min(1, "Question cannot be empty").optional(),
      answer: z.string().trim().optional(),
      isAnswered: z.boolean().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const deleteQuestionValidation = z.object({
  params: questionParamsSchema,
});

export const createAssumptionValidation = z.object({
  params: opportunityParamsSchema,
  body: z.object({
    assumption: z.string().trim().min(1, "Assumption cannot be empty"),
  }),
});

export const updateAssumptionValidation = z.object({
  params: assumptionParamsSchema,
  body: z.object({
    assumption: z.string().trim().min(1, "Assumption cannot be empty"),
  }),
});

export const deleteAssumptionValidation = z.object({
  params: assumptionParamsSchema,
});
