import z from "zod";

export const resetPasswordValidator = z.object({
  newPassword: z
    .string("New password is required")
    .trim()
    .min(8, "New password must be atleast 8 characters long"),
  confirmPassword: z
    .string("Confirm password is required")
    .trim()
    .min(8, "Confirm password must be atleast 8 characters long"),
});

export type resetPasswordValidatorType = z.infer<typeof resetPasswordValidator>;
