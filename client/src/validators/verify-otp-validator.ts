import z from "zod";

export const verifyOtpValidator = z.object({
  otp: z
    .string("OTP is required")
    .trim()
    .length(6, "OTP must be 6 digits long"),
  email: z.email("Email is required and should be valid"),
});

export type verifyOtpValidatorType = z.infer<typeof verifyOtpValidator>;
