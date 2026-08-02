import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

const technologyCategorySchema = z.enum([
  "Frontend",
  "Backend",
  "Mobile",
  "Database",
  "DevOps",
  "Cloud",
  "AI",
  "Testing",
  "CMS",
  "E-commerce",
]);

export const addTechnologyValidation = z.object({
  technologyName: z.string().trim().min(1, "Technology name cannot be empty"),

  category: technologyCategorySchema,

  preferredUsecase: z
    .string()
    .trim()
    .min(1, "Preferred usecase cannot be empty"),

  notes: z.string().trim().optional(),
});

export const updateTechnologyValidation = z
  .object({
    technologyId: objectIdSchema,

    technologyName: z
      .string()
      .trim()
      .min(1, "Technology name cannot be empty")
      .optional(),

    category: technologyCategorySchema.optional(),

    preferredUsecase: z
      .string()
      .trim()
      .min(1, "Preferred usecase cannot be empty")
      .optional(),

    notes: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.technologyName !== undefined ||
      data.category !== undefined ||
      data.preferredUsecase !== undefined ||
      data.notes !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

export const deleteTechnologyValidation = z.object({
  technologyId: objectIdSchema,
});
