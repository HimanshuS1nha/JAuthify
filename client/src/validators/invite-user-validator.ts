import z from "zod";

export const inviteUserValidator = z.object({
  inviteeEmail: z.email("Email is required and must be valid"),
  role: z.enum(["Member", "Admin", "Owner"]),
});

export type inviteUserValidatorType = z.infer<typeof inviteUserValidator>;
