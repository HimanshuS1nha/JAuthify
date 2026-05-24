import z from "zod";

export const emailValidator = z.object({
  email: z.email("Email is required and should be valid"),
});

export type emailValidatorType = z.infer<typeof emailValidator>;
