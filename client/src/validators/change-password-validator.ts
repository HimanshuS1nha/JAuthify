import z from "zod";

export const changePasswordValidator = z.object({
  oldPassword: z
    .string("Old Password is required")
    .trim()
    .min(8, "Old Password must be atleast 8 characters long"),
  newPassword: z
    .string("New Password is required")
    .trim()
    .min(8, "New Password must be atleast 8 characters long"),
  confirmNewPassword: z
    .string("Confirm Password is required")
    .trim()
    .min(8, "Confirm Password must be atleast 8 characters long"),
});

export type changePasswordValidatorType = z.infer<
  typeof changePasswordValidator
>;
