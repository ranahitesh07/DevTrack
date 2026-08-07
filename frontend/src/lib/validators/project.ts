import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100),

  description: z
    .string()
    .optional(),
});

export type ProjectFormData =
  z.infer<typeof projectSchema>;