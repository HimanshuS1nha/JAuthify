import z from "zod";

export const verifyEmailValidator = z.object({
  otp: z
    .string("OTP is required")
    .trim()
    .length(6, "OTP must be 6 digits long"),
});

export type verifyEmailValidatorType = z.infer<typeof verifyEmailValidator>;
