import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

const technologyParamsSchema = z.object({
  technologyId: objectIdSchema,
});

export const addTechnologyValidation = z.object({
  body: z.object({
    technologyName: z.string().trim().min(1, "Technology name cannot be empty"),
    category: z.enum([
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
    ]),
    preferredUsecase: z
      .string()
      .trim()
      .min(1, "Preferred usecase cannot be empty"),
    notes: z.string().trim().optional(),
  }),
});

export const updateTechnologyValidation = z.object({
  params: technologyParamsSchema,
  body: z
    .object({
      technologyName: z
        .string()
        .trim()
        .min(1, "Technology name cannot be empty")
        .optional(),
      category: z
        .enum([
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
        ])
        .optional(),
      preferredUsecase: z
        .string()
        .trim()
        .min(1, "Preferred usecase cannot be empty")
        .optional(),
      notes: z.string().trim().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const deleteTechnologyValidation = z.object({
  params: technologyParamsSchema,
});
