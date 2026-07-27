import z, { length } from "zod"

export const createOpportunitySchema = z.object({
    projectName: z
        .string({ error: "Project name is required" })
        .trim()
        .min(3, "Project name must be at least 3 characters"),
    clientName: z
        .string({ error: "Client name is required" })
        .trim()
        .min(2, "Client name must be at least 2 characters")
        .max(30, "Client name cannot exceed 30 characters"),
    industry: z
        .string()
        .optional(),
    contactPerson: z
        .string({ error: "Contact person is required" })
        .trim()
        .min(2, "Contact person must be at least 2 characters")
        .max(30, "Contact person cannot exceed 30 characters"),
    contactEmail: z
        .string({ error: "Email is required" })
        .email({ error: "Contact email must be a vaild email" }),
    contactPhone: z
        .string()
        .regex(/^\d{11}$/, "Phone number must be exactly 11 digits")
        .optional(),
    generalNotes: z
        .string()
        .optional(),
})
export const updateOpportunitySchema = z.object({
    projectName: z
        .string()
        .trim()
        .min(3, "Project name must be at least 3 characters")
        .optional(),

    clientName: z
        .string()
        .trim()
        .min(2, "Client name must be at least 2 characters")
        .max(30, "Client name cannot exceed 30 characters")
        .optional(),

    industry: z
        .string()
        .optional(),

    contactPerson: z
        .string()
        .trim()
        .min(2, "Contact person must be at least 2 characters")
        .max(30, "Contact person cannot exceed 30 characters")
        .optional(),

    contactEmail: z
        .string()
        .email("Contact email must be a valid email")
        .optional(),

    contactPhone: z
        .string()
        .regex(/^\d{11}$/, "Phone number must be exactly 11 digits")
        .optional(),

    generalNotes: z
        .string()
        .optional(),
});