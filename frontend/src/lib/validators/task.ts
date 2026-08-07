import { z } from "zod";

export const taskSchema = z.object({
  project_id: z.string().min(1),

  title: z
    .string()
    .min(3, "Title must be at least 3 characters"),

  description: z.string().optional(),

  priority: z.enum([
    "Low",
    "Medium",
    "High",
  ]),

  status: z.enum([
    "Todo",
    "In Progress",
    "Completed",
  ]),
});

export type TaskFormData =
  z.infer<typeof taskSchema>;