import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  email: z.email({
    message: "Enter a valid email",
  }),
});

export const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(6),

    new_password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirm_password: z
      .string()
      .min(6),
  })
  .refine(
    (data) =>
      data.new_password ===
      data.confirm_password,
    {
      message: "Passwords do not match",
      path: ["confirm_password"],
    }
  );

export type ProfileFormData =
  z.infer<typeof profileSchema>;

export type PasswordFormData =
  z.infer<typeof passwordSchema>;